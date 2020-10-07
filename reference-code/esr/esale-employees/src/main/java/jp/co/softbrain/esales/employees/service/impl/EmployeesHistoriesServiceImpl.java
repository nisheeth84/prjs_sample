package jp.co.softbrain.esales.employees.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.domain.EmployeesHistories;
import jp.co.softbrain.esales.employees.repository.EmployeesHistoriesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepository;
import jp.co.softbrain.esales.employees.service.EmployeesHistoriesService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeHistoryOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeHistoryOutSubType1DTO;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesHistoriesMapper;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.StringUtil;

/**
 * Service Implementation for managing {@link EmployeesHistories}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesHistoriesServiceImpl implements EmployeesHistoriesService {

    private static final String ITEM_VALUE_INVALID = "Item's value is invalid";
    private static final Integer EMPLOYEE_STATUS_DELETE = 2;

    private final EmployeesHistoriesRepository employeesHistoriesRepository;

    private final EmployeesHistoriesMapper employeesHistoriesMapper;

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private TmsService tmsService;

    Gson gson = new Gson();

    public EmployeesHistoriesServiceImpl(EmployeesHistoriesRepository employeesHistoriesRepository,
            EmployeesHistoriesMapper employeesHistoriesMapper) {
        this.employeesHistoriesRepository = employeesHistoriesRepository;
        this.employeesHistoriesMapper = employeesHistoriesMapper;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesHistoriesService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO)
     */
    @Override
    public EmployeesHistoriesDTO save(EmployeesHistoriesDTO employeesHistoriesDTO) {
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) { // @TMS
            EmployeesHistories employeesHistories = employeesHistoriesMapper.toEntity(employeesHistoriesDTO);
            return employeesHistoriesMapper.toDto(employeesHistoriesRepository.save(employeesHistories));
        } else {
            return tmsService.saveEmployeeHistory(employeesHistoriesDTO, TransIDHolder.getTransID());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesHistoriesService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesHistoriesDTO> findAll() {
        return employeesHistoriesRepository.findAll().stream().map(employeesHistoriesMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesHistoriesService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesHistoriesDTO> findOne(Long id) {
        EmployeesHistories employeesHistories = employeesHistoriesRepository.findByEmployeeHistoryId(id);
        if (employeesHistories != null) {
            return Optional.of(employeesHistories).map(employeesHistoriesMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesHistoriesService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        employeesHistoriesRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesHistoriesService#getEmployeeHistory(java.lang.Long,
     *      java.lang.Integer, java.lang.Integer)
     */
    @Override
    public GetEmployeeHistoryOutDTO getEmployeeHistory(Long employeeId, Integer currentPage, Integer limit) {
        // 1. Validate parameter require
        if (employeeId == null) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_ID, Constants.RIQUIRED_CODE));
        }
        // 2. get changed history information
        Integer offset = ((currentPage - 1) * limit) > 0 ? ((currentPage - 1) * limit) : 0;
        limit = limit > 0 ? limit : 0;
        List<EmployeesHistories> listChangedHistories = employeesHistoriesRepository.getChangedHistories(employeeId,
                limit, offset);
        // 3 get data relation
        GetEmployeeHistoryOutDTO outDTO = new GetEmployeeHistoryOutDTO();
        if (listChangedHistories == null || listChangedHistories.isEmpty()) {
            return outDTO;
        }
        listChangedHistories.stream().forEach(employeeHistory -> {
            GetEmployeeHistoryOutSubType1DTO history = new GetEmployeeHistoryOutSubType1DTO();
            history.setCreatedDate(DateUtil.convertInstantToString(employeeHistory.getCreatedDate(),
                    DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH_TIME));
            history.setCreatedUser(employeeHistory.getCreatedUser());
            history.setContentChange(employeeHistory.getContentChange());
            Employees emp = employeesRepository
                    .findOneByEmployeeIdAndEmployeeStatusNot(employeeHistory.getCreatedUser(), EMPLOYEE_STATUS_DELETE);
            if (emp == null) {
                outDTO.getEmployeeHistory().add(history);
                return;
            }
            String createdUserName = emp.getEmployeeSurname();
            if (StringUtils.isNotBlank(emp.getEmployeeName())) {
                createdUserName = createdUserName.concat(ConstantsEmployees.SPACE).concat(emp.getEmployeeName());
            }
            history.setCreatedUserName(createdUserName);

            String createdUserImage = emp.getPhotoFilePath();
            if (StringUtils.isNotBlank(createdUserImage)) {
                createdUserImage = S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        createdUserImage, applicationProperties.getExpiredSeconds());
                history.setCreatedUserImage(createdUserImage);
            }
            outDTO.getEmployeeHistory().add(history);
            // 4. add to response
        });
        return outDTO;
    }
}
