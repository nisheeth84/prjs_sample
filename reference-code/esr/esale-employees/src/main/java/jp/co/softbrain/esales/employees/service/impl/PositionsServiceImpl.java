package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.domain.Positions;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.PositionsRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.PositionsService;
import jp.co.softbrain.esales.employees.service.dto.CheckDeletePositionsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetPositionsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;
import jp.co.softbrain.esales.employees.service.dto.UpdatePositionsOutDTO;
import jp.co.softbrain.esales.employees.service.mapper.PositionsMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * PositionsServiceImpl for managing Positions
 *
 * @author QuangLV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class PositionsServiceImpl implements PositionsService {

    @Autowired
    private PositionsRepository positionsRepository;

    @Autowired
    private EmployeesDepartmentsRepository employeesDepartmentsRepository;

    private final PositionsMapper positionsMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private static final Long NUMBER_ZERO = 0L;

    private static final String UPDATE_POSITIONS = "updatePositions";

    /**
     * PositionsServiceImpl : function constructor of class
     * PgetPositionsMapperositionsServiceImpl
     *
     * @param positionsRepository
     * @param positionsMapper
     */
    public PositionsServiceImpl(PositionsRepository positionsRepository, PositionsMapper positionsMapper) {
        this.positionsRepository = positionsRepository;
        this.positionsMapper = positionsMapper;
    }

    /*
     * @see jp.co.softbrain.esales.employees.service PositionsService#getPositions()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetPositionsOutDTO getPositions() {

        GetPositionsOutDTO response = new GetPositionsOutDTO();

        // 1. Get list master position
        List<Positions> lstPosition = positionsRepository.findAll(Sort.by(Sort.Direction.ASC, "positionOrder"));

        List<PositionsDTO> positions = lstPosition.stream().map(positionsMapper::toDto).collect(Collectors.toList());

        // 2. Create data response
        response.setPositions(positions);
        return response;
    }

    /*
     * @see jp.co.softbrain.esales.employees.service
     * PositionsService#updatePositions(List<jp.co.softbrain.esales.employees.
     * service.dto.PositionsDTO>,List<Long>)
     */
    @Override
    @Transactional
    public UpdatePositionsOutDTO updatePositions(List<PositionsDTO> data, List<Long> deletedPositions) {
        UpdatePositionsOutDTO response = new UpdatePositionsOutDTO();
        List<Long> lstIdDelete = new ArrayList<>();
        List<Long> lstIdInsert = new ArrayList<>();
        List<Long> lstIdUpdate = new ArrayList<>();

        // 1. Check authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permision",
                    CommonUtils.putError(ConstantsEmployees.COLUMN_NAME_USER_ID, Constants.USER_NOT_PERMISSION));
        }

        if (deletedPositions != null && !deletedPositions.isEmpty()) {

            // 2. Validate parameter
            CheckDeletePositionsOutDTO lstPositionId = this.getCheckDeletePositions(deletedPositions);
            if (!lstPositionId.getPositionIds().isEmpty()) {
                throw new CustomRestException("positions existed",
                        CommonUtils.putError(UPDATE_POSITIONS, ConstantsEmployees.POSITION_EXISTED));
            }

            // 3. Delete Positions
            List<Positions> lstReturnPositions = positionsRepository.findByPositionIdIn(deletedPositions);
            positionsRepository.deletebyPositionId(deletedPositions);
            lstIdDelete = lstReturnPositions.stream().map(Positions::getPositionId).collect(Collectors.toList());
        }

        // 4. Insert Update Positions
        if (data != null && !data.isEmpty()) {
            for (PositionsDTO dto : data) {

                // 4.1. Insert Positions
                if (NUMBER_ZERO.equals(dto.getPositionId())) {
                    lstIdInsert.add(saveToEntity(dto));
                }
                // 4.2. Update Positions
                else {
                    this.findOne(dto.getPositionId())
                            .ifPresentOrElse(positionsDTO -> lstIdUpdate.add(saveToEntity(dto)), () -> {
                                throw new CustomRestException("error-exclusive",
                                        CommonUtils.putError(UPDATE_POSITIONS, Constants.EXCLUSIVE_CODE));
                            });
                }
            }
        }

        // 6.Create data response
        response.setDeletedPositions(lstIdDelete);
        response.setInsertedPositions(lstIdInsert);
        response.setUpdatedPositions(lstIdUpdate);
        return response;

    }

    /**
     * saveToEntity : insert or update Positions to entity
     *
     * @param dto
     *            : data insert or update Positions
     * @return Long : position id after insert or update
     */
    private Long saveToEntity(PositionsDTO dto) {
        Positions entity = positionsMapper.toEntity(dto);
        entity.setPositionId(NUMBER_ZERO.equals(dto.getPositionId()) ? null : dto.getPositionId());
        if (dto.getPositionId().equals(NUMBER_ZERO)) {
            entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        }
        entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity = positionsRepository.save(entity);
        return entity.getPositionId();
    }

    /*
     * @see jp.co.softbrain.esales.employees.service PositionsService#findOne(Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<PositionsDTO> findOne(Long id) {
        Positions positions = positionsRepository.findByPositionId(id);
        if (positions != null) {
            return Optional.of(positions).map(positionsMapper::toDto);
        }
        return Optional.empty();
    }

    /*
     * @see jp.co.softbrain.esales.employees.service
     * EmployeesDepartmentsService#checkDeletePositions(List<Long>)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CheckDeletePositionsOutDTO getCheckDeletePositions(List<Long> positionIds) {

        CheckDeletePositionsOutDTO response = new CheckDeletePositionsOutDTO();
        List<EmployeesDepartments> lstPosition = employeesDepartmentsRepository.findByPositionIdIn(positionIds);

        List<Long> lstpositionId = lstPosition.stream().map(EmployeesDepartments::getPositionId)
                .collect(Collectors.toList());
        response.setPositionIds(lstpositionId.stream().distinct().collect(Collectors.toList()));

        return response;
    }
}
