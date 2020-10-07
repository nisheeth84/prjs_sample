package jp.co.softbrain.esales.commons.service.impl;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.ImportHistories;
import jp.co.softbrain.esales.commons.repository.ImportHistoriesRepository;
import jp.co.softbrain.esales.commons.repository.ImportHistoriesRepositoryCustom;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.ImportHistoriesService;
import jp.co.softbrain.esales.commons.service.dto.GetEmployeesByIdsRequest;
import jp.co.softbrain.esales.commons.service.dto.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.commons.service.dto.GetImportHistoriesDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportHistoriesDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateImportHistoryOutDTO;
import jp.co.softbrain.esales.commons.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.commons.service.mapper.ImportHistoriesMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportHistoriesRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ImportHistoriesRequestDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateImportHistoryRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ImportHistoriesResponse;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * ImportHistoriesServiceImpl
 *
 * @author HaiCN
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ImportHistoriesServiceImpl implements ImportHistoriesService {

    @Autowired
    private ImportHistoriesRepository importHistoriesRepository;

    @Autowired
    private ImportHistoriesRepositoryCustom importHistoriesRepositoryCustom;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private static final String CHECK_EXIST_IMPORT_ID = "Value of param [importId] is invalid";
    private static final String IMPORT_ID = "importId";
    private static final String CHECK_EXIST_IS_IMPORT_SUCCEED = "Value of param [isImportSucceed] is invalid";
    private static final String IS_IMPORT_SUCCEED = "isImportSucceed";
    private static final String CHECK_EXIST_SERVICE_ID = "Value of param [importHistoryId] is invalid";
    private static final String SERVICE_ID = "serviceId";
    private static final String ERR_COM_0013 = "ERR_COM_0013";
    private static final String API_GET_EMPLOYEES_BY_IDS = "get-employees-by-ids";

    private final ImportHistoriesMapper importHistoriesMapper;

    public ImportHistoriesServiceImpl(ImportHistoriesMapper importHistoriesMapper) {
        this.importHistoriesMapper = importHistoriesMapper;
    }

    /**
     * Get import histories
     *
     * @param getImportHistoriesRequest request to save import history
     * @return list record import histories
     */
    @Override
    public ImportHistoriesResponse getImportHistories(GetImportHistoriesRequest getImportHistoriesRequest) {
        ImportHistoriesResponse importHistoriesResponse = new ImportHistoriesResponse();

        // 1. Validate parameter
        if (getImportHistoriesRequest.getServiceId() == null) {
            throw new CustomRestException(CHECK_EXIST_SERVICE_ID, CommonUtils.putError(SERVICE_ID, ERR_COM_0013));
        }

        // 2. Get import histories
        Instant startedDate = Instant.now().minus(90, ChronoUnit.DAYS);
        List<GetImportHistoriesDTO> importHistories = importHistoriesRepositoryCustom.getImportHistories(
                getImportHistoriesRequest.getServiceId(), getImportHistoriesRequest.getImportId(),
                getImportHistoriesRequest.getOrderBy(), getImportHistoriesRequest.getLimit(),
                getImportHistoriesRequest.getOffset(), startedDate);

        List<ImportHistoriesDTO> importHistoriesDTOs = new ArrayList<>();
        for (GetImportHistoriesDTO getImportHistories1DTO : importHistories) {
            ImportHistoriesDTO importHistoriesDTO = new ImportHistoriesDTO();
            importHistoriesDTO.setImportId(getImportHistories1DTO.getImportId());
            importHistoriesDTO.setImportFileName(getImportHistories1DTO.getImportFileName());
            importHistoriesDTO.setImportFilePath(getImportHistories1DTO.getImportFilePath());
            importHistoriesDTO.setErrorCount(getImportHistories1DTO.getErrorCount());
            importHistoriesDTO.setUpdatedCount(getImportHistories1DTO.getUpdatedCount());
            importHistoriesDTO.setInsertedCount(getImportHistories1DTO.getInsertedCount());
            importHistoriesDTO.setImportErrorFilePath(getImportHistories1DTO.getImportErrorFilePath());
            importHistoriesDTO.setCreatedDate(getImportHistories1DTO.getCreatedDate());
            importHistoriesDTO.setCreatedUser(getImportHistories1DTO.getCreatedUser());
            importHistoriesDTO.setUpdatedDate(getImportHistories1DTO.getUpdatedDate());
            importHistoriesDTO.setUpdatedUser(getImportHistories1DTO.getUpdatedUser());
            importHistoriesDTOs.add(importHistoriesDTO);
        }

        // 3. Call API getEmployeesByIds
        if (!importHistoriesDTOs.isEmpty()) {
            List<EmployeeInfoDTO> employees;
            List<Long> createdUsers = new ArrayList<>();
            for (ImportHistoriesDTO importHistoriesDTO : importHistoriesDTOs) {
                createdUsers.add(importHistoriesDTO.getCreatedUser());
            }
            try {
                GetEmployeesByIdsRequest getEmployeesByIdsRequest = new GetEmployeesByIdsRequest(createdUsers);
                employees = restOperationUtils
                        .executeCallApi(Constants.PathEnum.EMPLOYEES, API_GET_EMPLOYEES_BY_IDS, HttpMethod.POST,
                                getEmployeesByIdsRequest, GetEmployeesByIdsResponse.class,
                                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken())
                        .getEmployees();
            } catch (IllegalStateException e) {
                throw new CustomException(e.getMessage());
            }
            if (employees != null && !employees.isEmpty()) {
                for (int i = 0; i < employees.size(); i++) {
                    importHistoriesDTOs.get(i).setEmployeeName(employees.get(i).getEmployeeName());
                }
            }
        }
        importHistoriesResponse.setImportHistories(importHistoriesDTOs);

        return importHistoriesResponse;
    }

    @Override
    public ImportHistoriesDTO save(ImportHistoriesRequestDTO importHistoriesDTO) throws IOException {
        ImportHistories importHistories = mappingFromDtoToEntity(importHistoriesDTO);
        if ( importHistories == null ) {
            return null;
        }
        importHistories = importHistoriesRepository.save(importHistories);
        return importHistoriesMapper.toDto(importHistories);
    }

    @Override
    public ImportHistoriesResponse getImportHistory(Long importHistoryId) {
        ImportHistoriesResponse importHistoriesResponse = new ImportHistoriesResponse();

        importHistoriesRepository.getImportHistoriesByImportHistoryId(importHistoryId)
            .ifPresent(e -> importHistoriesResponse
                .setImportHistories(Collections.singletonList(importHistoriesMapper.toDto(e))));

        return importHistoriesResponse;
    }

    private ImportHistories mappingFromDtoToEntity(ImportHistoriesRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }
        ImportHistories importHistories = new ImportHistories();
        importHistories.setCreatedDate( dto.getCreatedDate() );
        importHistories.setCreatedUser( dto.getCreatedUser() );
        importHistories.setUpdatedDate( dto.getUpdatedDate() );
        importHistories.setUpdatedUser( dto.getUpdatedUser() );
        importHistories.setImportHistoryId( dto.getImportHistoryId() );
        importHistories.setIsImportSucceed( dto.getIsImportSucceed() );
        importHistories.setErrorCount( dto.getErrorCount() );
        importHistories.setInsertedCount( dto.getInsertedCount() );
        importHistories.setUpdatedCount( dto.getUpdatedCount() );
        importHistories.setImportErrorFilePath( dto.getImportErrorFilePath() );

        return importHistories;
    }
    
    /**
     * Update import history
     *
     * @param updateImportHistoryRequest request to save import history
     * @return importHistoryId of the updated record
     */
    @Override
    public UpdateImportHistoryOutDTO updateImportHistory(UpdateImportHistoryRequest updateImportHistoryRequest) {
        UpdateImportHistoryOutDTO response = new UpdateImportHistoryOutDTO();
        // 1. Validate parameter
        if (updateImportHistoryRequest.getImportId() == null) {
            throw new CustomRestException(CHECK_EXIST_IMPORT_ID, CommonUtils.putError(IMPORT_ID, ERR_COM_0013));
        }
        if (updateImportHistoryRequest.getIsImportSucceed() == null) {
            throw new CustomRestException(CHECK_EXIST_IS_IMPORT_SUCCEED, CommonUtils.putError(IS_IMPORT_SUCCEED, ERR_COM_0013));
        }

        // 2. Get import histories
        ImportHistories importHistories = importHistoriesRepository.findByImportId(updateImportHistoryRequest.getImportId());
        // 3. Insert import histories
        if (importHistories == null) {
            importHistories = new ImportHistories();
            importHistories.setImportId(updateImportHistoryRequest.getImportId());
            importHistories.setIsImportSucceed(updateImportHistoryRequest.getIsImportSucceed());
            importHistories.setErrorCount(updateImportHistoryRequest.getErrorCount());
            importHistories.setInsertedCount(updateImportHistoryRequest.getInsertedCount());
            importHistories.setUpdatedCount(updateImportHistoryRequest.getUpdatedCount());
            importHistories.setImportErrorFilePath(updateImportHistoryRequest.getImportErrorFilePath());
            importHistories.setCreatedDate(Instant.now());
            importHistories.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            importHistories.setUpdatedDate(Instant.now());
            importHistories.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        // 4. Update import histories
        } else {
            importHistories.setIsImportSucceed(updateImportHistoryRequest.getIsImportSucceed());
            importHistories.setErrorCount(updateImportHistoryRequest.getErrorCount());
            importHistories.setInsertedCount(updateImportHistoryRequest.getInsertedCount());
            importHistories.setUpdatedCount(updateImportHistoryRequest.getUpdatedCount());
            importHistories.setImportErrorFilePath(updateImportHistoryRequest.getImportErrorFilePath());
            importHistories.setUpdatedDate(Instant.now());
            importHistories.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        }
        importHistories = importHistoriesRepository.save(importHistories);
        response.setImportHistoryId(importHistories.getImportHistoryId());
        return response;
    }
}
