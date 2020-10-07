package jp.co.softbrain.esales.customers.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.domain.MastersScenarios;
import jp.co.softbrain.esales.customers.domain.MastersScenariosDetails;
import jp.co.softbrain.esales.customers.repository.CustomersRepository;
import jp.co.softbrain.esales.customers.repository.MastersScenariosDetailsRepository;
import jp.co.softbrain.esales.customers.repository.MastersScenariosRepository;
import jp.co.softbrain.esales.customers.repository.MastersScenariosRepositoryCustom;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService;
import jp.co.softbrain.esales.customers.service.MastersScenariosService;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioSubTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenarioResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterScenariosSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.MasterScenariosSubType2DTO;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDTO;
import jp.co.softbrain.esales.customers.service.dto.SaveScenarioSubIn1DTO;
import jp.co.softbrain.esales.customers.service.dto.SaveScenarioSubIn2DTO;
import jp.co.softbrain.esales.customers.service.dto.SaveScenarioSubIn3DTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateMasterScenariosSubType2DTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.DeleteMilestoneRequest;
import jp.co.softbrain.esales.customers.service.mapper.MastersScenariosMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.util.ChannelUtils;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveScenarioRequest;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Implement from service {@link MastersScenariosService}
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MastersScenariosServiceImpl implements MastersScenariosService {

    public static final String SCENARIO_NAME = "scenarioName";

    public static final String SCENARIO_ID = "scenarioId";

    public static final Long NUMBER_ZERO = 0L;

    private static final String USER_DOES_NOT_HAVE_PERMISSION = "User does not have permission.";

    private static final String ERRORS_NAME = "errors";

    @Autowired
    private MastersScenariosMapper mastersScenariosMapper;

    @Autowired
    private MastersScenariosDetailsRepository mastersScenariosDetailsRepository;

    @Autowired
    private MastersScenariosRepository mastersScenariosRepository;

    @Autowired
    private MastersScenariosRepositoryCustom mastersScenariosRepositoryCustom;

    @Autowired
    private MastersScenariosDetailsService mastersScenariosDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private ChannelUtils channelUtils;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private RestOperationUtils restOperationUtils;

    private static final String UPDATE_MASTER_SCENARIO = "updateMasterScenario";

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#save(jp.co.softbrain.esales.customers.domain.MastersScenarios)
     */
    @Override
    public MastersScenariosDTO save(MastersScenariosDTO dto) {
        MastersScenarios entity = mastersScenariosMapper.toEntity(dto);
        entity = mastersScenariosRepository.save(entity);
        return mastersScenariosMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        mastersScenariosRepository.deleteByScenarioId(id);

    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<MastersScenariosDTO> findOne(Long id) {
        return mastersScenariosRepository.findByScenarioId(id).map(mastersScenariosMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<MastersScenariosDTO> findAll(Pageable pageable) {
        return mastersScenariosRepository.findAll(pageable).map(mastersScenariosMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MastersScenariosDTO> findAll() {
        return mastersScenariosRepository.findAll().stream().map(mastersScenariosMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service
     *      MastersScenariosService#getMasterScenarioDTO(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public MasterScenariosSubType1DTO getMasterScenario(Long scenarioId) {
        if (scenarioId == null) {
            throw new CustomRestException("Param [scenarioId] is null.",
                    CommonUtils.putError(SCENARIO_ID, Constants.RIQUIRED_CODE));
        }
        // 1. validate common
        List<Map<String, Object>> errors = new ArrayList<>();
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.SCENARIO_ID, scenarioId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        errors.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        // 2. Get Data Scenario
        MasterScenariosSubType1DTO resonse = new MasterScenariosSubType1DTO();
        List<GetMasterScenarioResponseDTO> listDto = mastersScenariosRepositoryCustom.getMasterScenario(scenarioId);
        Map<Long, MasterScenariosSubType1DTO> mapsScenarios = new HashMap<>();
        Map<Long, List<MasterScenariosSubType2DTO>> mapMilestones = new HashMap<>();

        // 3. create response
        listDto.stream().forEach(listdt -> {
            resonse.setScenarioId(listdt.getScenarioId());
            resonse.setScenarioName(listdt.getScenarioName());
            resonse.setUpdatedDate(listdt.getUpdatedDate());

            if (!mapsScenarios.containsKey(listdt.getScenarioId())) {
                mapsScenarios.put(listdt.getScenarioId(), resonse);
            }

            MasterScenariosSubType2DTO milestones = new MasterScenariosSubType2DTO();
            milestones.setScenarioDetailId(listdt.getScenarioDetailId());
            milestones.setMilestoneName(listdt.getMilestoneName());
            milestones.setUpdatedDate(listdt.getUpdatedDateDetail());
            milestones.setDisplayOrder(listdt.getDisplayOrder());

            if (!mapMilestones.containsKey(listdt.getScenarioId())) {
                List<MasterScenariosSubType2DTO> listMilestones = new ArrayList<>();
                listMilestones.add(milestones);
                mapMilestones.put(listdt.getScenarioId(), listMilestones);
            } else {
                mapMilestones.get(listdt.getScenarioId()).add(milestones);
            }
        });
        mapsScenarios.forEach((k, v) -> v.setMilestones(mapMilestones.get(k)));

        // response
        return resonse;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service
     *      MastersScenariosService#getMasterScenarios()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetMasterScenariosOutDTO getMasterScenarios() {
        // 1. Get Data Scenario
        GetMasterScenariosOutDTO response = new GetMasterScenariosOutDTO();
        List<MasterScenariosSubType1DTO> listScenarios = new ArrayList<>();
        List<GetMasterScenariosResponseDTO> listDto = mastersScenariosRepositoryCustom.getMasterScenarios();
        Map<Long, MasterScenariosSubType1DTO> mapsScenarios = new HashMap<>();
        Map<Long, List<MasterScenariosSubType2DTO>> mapMilestones = new HashMap<>();

        // 2. create response
        listDto.stream().forEach(listdt -> {
            MasterScenariosSubType1DTO scenarios = new MasterScenariosSubType1DTO();
            scenarios.setScenarioId(listdt.getScenarioId());
            scenarios.setScenarioName(listdt.getScenarioName());
            scenarios.setUpdatedDate(listdt.getUpdatedDate());

            if (!mapsScenarios.containsKey(listdt.getScenarioId())) {
                mapsScenarios.put(listdt.getScenarioId(), scenarios);
            }

            MasterScenariosSubType2DTO milestones = new MasterScenariosSubType2DTO();
            milestones.setScenarioDetailId(listdt.getScenarioDetailId());
            milestones.setMilestoneName(listdt.getMilestoneName());
            milestones.setUpdatedDate(listdt.getUpdatedDateDetail());

            if (!mapMilestones.containsKey(listdt.getScenarioId())) {
                List<MasterScenariosSubType2DTO> listMilestones = new ArrayList<>();
                listMilestones.add(milestones);
                mapMilestones.put(listdt.getScenarioId(), listMilestones);
            } else {
                mapMilestones.get(listdt.getScenarioId()).add(milestones);
            }
        });
        mapsScenarios.forEach((k, v) -> {
            v.setMilestones(mapMilestones.get(k));
            listScenarios.add(v);
        });

        response.setScenarios(listScenarios);

        // response
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service
     *      MastersScenariosService#updateMasterScenarios(List, List)
     */
    @Override
    @Transactional
    public UpdateMasterScenariosOutDTO updateMasterScenarios(Long scenarioId, String scenarioName, Instant updatedDate,
            List<Long> deletedScenarios, List<UpdateMasterScenariosSubType2DTO> milestones) {

        // 1. Check User permissions
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(USER_DOES_NOT_HAVE_PERMISSION,
                    CommonUtils.putError("user_id", Constants.USER_NOT_PERMISSION));
        }

        // 2. Validate Parameter
        if (scenarioId == null) {
            throw new CustomRestException("Param [scenarioId] is null.",
                    CommonUtils.putError(SCENARIO_ID, Constants.RIQUIRED_CODE));
        }
        if (StringUtils.isBlank(scenarioName)) {
            throw new CustomRestException("Param [scenarioName] is null.",
                    CommonUtils.putError(SCENARIO_NAME, Constants.RIQUIRED_CODE));
        }

        UpdateMasterScenariosOutDTO response = new UpdateMasterScenariosOutDTO();

        // 3. Update scenario
        this.findOne(scenarioId).ifPresentOrElse(dto -> {
            MastersScenarios entity = new MastersScenarios();
            entity.setScenarioId(scenarioId);
            entity.setScenarioName(scenarioName);
            entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            response.setScenarioId(mastersScenariosRepository.save(entity).getScenarioId());
        }, () -> {
            throw new CustomRestException("error-exclusive",
                    CommonUtils.putError(UPDATE_MASTER_SCENARIO, Constants.EXCLUSIVE_CODE));
        });

        // 4. Delete milestone
        if (deletedScenarios != null && !deletedScenarios.isEmpty()) {
            mastersScenariosDetailsRepository.deleteByScenarioIdAndScenarioDetailId(scenarioId, deletedScenarios);
        }

        // 5. Loop list milestone need to insert/update
        if (milestones != null) {
            milestones.forEach(milestone -> {
                if (NUMBER_ZERO.equals(milestone.getScenarioDetailId()) || milestone.getScenarioDetailId() == null) {
                    saveMastersScenariosDetails(milestone, scenarioId);
                } else {
                    mastersScenariosDetailsService.findOne(milestone.getScenarioDetailId())
                            .filter(dto -> dto.getScenarioId().equals(scenarioId) && dto.getScenarioDetailId()
                                    .equals(milestone.getScenarioDetailId()))
                            .ifPresentOrElse(dto -> {
                                MastersScenariosDetails entity = new MastersScenariosDetails();
                                entity.setScenarioDetailId(milestone.getScenarioDetailId());
                                entity.setScenarioId(dto.getScenarioId());
                                entity.setCreatedUser(dto.getCreatedUser());
                                entity.setMilestoneName(milestone.getMilestoneName());
                                entity.setDisplayOrder(milestone.getDisplayOrder());
                                entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                                mastersScenariosDetailsRepository.save(entity);
                            }, () -> {
                                throw new CustomRestException("error-exclusive",
                                        CommonUtils.putError(UPDATE_MASTER_SCENARIO, Constants.EXCLUSIVE_CODE));
                            });
                }
            });
        }

        // 5. Create data response
        return response;
    }

    /**
     * saveMastersScenariosDetails : insert or update MastersScenariosDetails
     *
     * @param milestone
     *            : The Milestones
     * @param scenarioId
     *            : scenario id
     */
    private void saveMastersScenariosDetails(UpdateMasterScenariosSubType2DTO milestone, Long scenarioId) {
        MastersScenariosDetails entity = new MastersScenariosDetails();
        entity.setScenarioDetailId(null);
        entity.setScenarioId(scenarioId);
        entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity.setMilestoneName(milestone.getMilestoneName());
        entity.setDisplayOrder(milestone.getDisplayOrder());
        entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        mastersScenariosDetailsRepository.save(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#createMasterScenario(String,
     *      List)
     */
    @Override
    @Transactional(transactionManager = "tenantTransactionManager")
    public CreateMasterScenarioOutDTO createMasterScenario(String scenarioName,
            List<CreateMasterScenarioSubTypeDTO> milestones) {
        // 1. Check User permissions
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(
                    CommonUtils.putError(USER_DOES_NOT_HAVE_PERMISSION, Constants.USER_NOT_PERMISSION));
        }

        // 2. Validate Parameter
        if (scenarioName == null || scenarioName.isEmpty()) {
            throw new CustomRestException(
                    CommonUtils.putError(ConstantsCustomers.SCENARIONAME_NULL, Constants.RIQUIRED_CODE));
        }

        // 3. Insert scenario
        MastersScenarios entity = new MastersScenarios();
        entity.setScenarioName(scenarioName);
        entity.setScenarioId(null);
        entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity = mastersScenariosRepository.save(entity);

        // 4. Insert master scenario detail
        if (milestones != null && !milestones.isEmpty()) {
            for (CreateMasterScenarioSubTypeDTO dto : milestones) {
                MastersScenariosDetails entityDetail = new MastersScenariosDetails();
                entityDetail.setScenarioId(entity.getScenarioId());
                entityDetail.setMilestoneName(dto.getMilestoneName());
                entityDetail.setDisplayOrder(dto.getDisplayOrder());
                entityDetail.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                entityDetail.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                mastersScenariosDetailsRepository.save(entityDetail);
            }
        }

        // 5. create response
        CreateMasterScenarioOutDTO response = new CreateMasterScenarioOutDTO();
        response.setScenarioId(entity.getScenarioId());
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#deleleMasterScenario(String,
     *      List)
     */
    @Override
    @Transactional
    public CreateMasterScenarioOutDTO deleleMasterScenario(Long scenarioId) {
        // 1. Validate Parameter
        if (scenarioId.equals(NUMBER_ZERO)) {
            throw new CustomRestException(
                    CommonUtils.putError(ConstantsCustomers.SCENARIOID_NULL, Constants.RIQUIRED_CODE));
        }
        // 2. check status already scenario
        Customers objCheck = customersRepository.findOneByScenarioId(scenarioId);
        if (objCheck != null) {
            throw new CustomRestException("", CommonUtils.putError(ConstantsCustomers.DELETE_MASTER_SCENARIO,
                    ConstantsCustomers.DELETE_MASTERSCENARIO));
        }
        // 3. Delete scenario
        // 3.1. Delete milestone
        mastersScenariosDetailsRepository.deleteByScenarioId(scenarioId);
        // 3.2. Delete masters_scenarios
        mastersScenariosRepository.deleteByScenarioId(scenarioId);
        // create response
        CreateMasterScenarioOutDTO response = new CreateMasterScenarioOutDTO();
        response.setScenarioId(scenarioId);
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosService#saveScenario(jp.co.softbrain.esales.customers.web.rest.vm.request.SaveScenarioRequest)
     */
    @Override
    @Transactional
    public Long saveScenario(SaveScenarioRequest request) {
        Long customerId = request.getCustomerId();
        Long scenarioId = request.getScenarioId();
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        // 1. Validate
        if (customerId == null) {
            throw new CustomRestException(
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }
        // 2. Save scenario info
        if (scenarioId != null) {
            Optional<Customers> customers = customersRepository.findByCustomerId(customerId);
            customers.ifPresent(cus -> {
                cus.setScenarioId(scenarioId);
                customersRepository.save(cus);
            });
        }
        // 2.2 Update data milestone
        List<SaveScenarioSubIn1DTO> milestones = request.getMilestones();
        List<Map<String, Object>> errors = new ArrayList<>();
        int indexMilestone = 0;
        for (SaveScenarioSubIn1DTO miles : milestones) {
            if (Boolean.TRUE.equals(miles.getFlagDelete())) {
                errors.addAll(deleteMilestoneAndTask(miles, token, tenantName, indexMilestone));
            } else if (miles.getMilestoneId() == null) {
                errors.addAll(createMilestonesAndEditTask(miles, customerId, token, tenantName, indexMilestone));
            } else if (miles.getMilestoneId() != null) {
                errors.addAll(updateMilestonesAndEditTask(miles, customerId, token, tenantName, indexMilestone));
            }
            indexMilestone++;
        }

        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        return scenarioId;
    }

    /**
     * Update milestont and task of it
     * 
     * @param miles
     *            miles
     * @param customerId
     *            customerId
     * @param token
     *            token
     * @param tenantName
     *            tenantName
     * @param indexMilestone 
     */
    private List<Map<String, Object>> updateMilestonesAndEditTask(SaveScenarioSubIn1DTO miles, Long customerId,
            String token, String tenantName, int indexMilestone) {

        List<Map<String, Object>> errors = new ArrayList<>();
        // Call API updateMileStone
        errors.addAll(channelUtils.callAPIUpdateMilestone(miles, customerId, token, tenantName, indexMilestone));

        // Tasks
        List<SaveScenarioSubIn2DTO> tasks = miles.getTasks();
        tasks.forEach(task -> {
            if (task.getTaskId() != null && Boolean.TRUE.equals(task.getFlagDelete())) {
                List<Long> taskIdsDelete = Collections.singletonList(task.getTaskId());
                // Call API delete Task
                errors.addAll(channelUtils.callAPIDeleteTasks(taskIdsDelete, token, tenantName, indexMilestone));
            } else if (task.getTaskId() != null) {
                // Call API updateTask
                errors.addAll(channelUtils.callAPIUpdateTask(task, miles.getMilestoneId(), customerId, token,
                        tenantName, indexMilestone));
            }
        });
        return errors;
    }


    /**
     * create Milestone and edit task
     * 
     * @param miles
     *            miles
     * @param customerId
     *            customerId
     * @param token
     *            token
     * @param tenantName
     *            tenantName
     * @param indexMilestone
     */
    private List<Map<String, Object>> createMilestonesAndEditTask(SaveScenarioSubIn1DTO miles,
            Long customerId,
            String token,
            String tenantName, int indexMilestone) {
        // Call API createMilestone
        List<Map<String, Object>> errors = new ArrayList<>();
        try {
            errors.addAll(channelUtils.callAPICreateMilestone(miles, customerId, token, tenantName, indexMilestone));
        } catch (CustomRestException e) {
            errors.addAll(getErrorRowIdMilestone(e, indexMilestone));
        }

        // Tasks
        List<SaveScenarioSubIn2DTO> tasks = miles.getTasks();
        tasks.forEach(task -> {
            if (task.getTaskId() != null && Boolean.TRUE.equals(task.getFlagDelete())) {
                List<Long> taskIdsDelete = Collections.singletonList(task.getTaskId());
                // Call API delete Task
                errors.addAll(channelUtils.callAPIDeleteTasks(taskIdsDelete, token, tenantName, indexMilestone));
            } else if (task.getTaskId() != null) {
                // Call API updateTask
                errors.addAll(channelUtils.callAPIUpdateTask(task, miles.getMilestoneId(), customerId, token,
                        tenantName, indexMilestone));
            }
        });
        return errors;
    }

    /**
     * delete milestone and task
     * 
     * @param miles
     *            miles
     * @param token
     *            token
     * @param tenantName
     *            tenantName
     * @param indexMilestone
     */
    private List<Map<String, Object>> deleteMilestoneAndTask(SaveScenarioSubIn1DTO miles, String token,
            String tenantName,
            int indexMilestone) {
        List<Map<String, Object>> errors = new ArrayList<>();
        // call API delete milestone
        DeleteMilestoneRequest deleteMilestoneRequest = new DeleteMilestoneRequest();
        deleteMilestoneRequest.setMilestoneId(miles.getMilestoneId());
        errors.addAll(channelUtils.callAPIdeleteMilestone(deleteMilestoneRequest, token, tenantName, indexMilestone));

        // Call API delete task
        List<SaveScenarioSubIn2DTO> tasks = miles.getTasks();
        List<Long> taskIdsDelete = getTaskIdList(tasks);
        errors.addAll(channelUtils.callAPIDeleteTasks(taskIdsDelete, token, tenantName, indexMilestone));

        return errors;
    }

    /**
     * Get error milestones
     * 
     * @param e
     *            exception
     * @param indexMilestone
     *            index row
     * @return error
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> getErrorRowIdMilestone(CustomRestException e, int indexMilestone) {
        Map<String, Object> errorsMap = e.getExtensions();
        List<Map<String, Object>> errorsListMap = (List<Map<String, Object>>) errorsMap.get(ERRORS_NAME);
        errorsListMap.forEach(mapError -> {
            if (mapError.get(Constants.ERROR_CODE) != null) {
                mapError.put(Constants.ROW_ID, indexMilestone);
            }
        });
        return errorsListMap;
    }


    /**
     * get task id list
     * 
     * @param tasks
     *            tasks
     * @return list id
     */
    private List<Long> getTaskIdList(List<SaveScenarioSubIn2DTO> tasks) {
        List<Long> taskIds = tasks.stream().map(SaveScenarioSubIn2DTO::getTaskId).collect(Collectors.toList());
        tasks.forEach(task -> {
            taskIds.add(task.getTaskId());
            if (task.getSubTasks() != null) {
                taskIds.addAll(
                        task.getSubTasks().stream().map(SaveScenarioSubIn3DTO::getTaskId).collect(Collectors.toList()));
            }
        });
        return taskIds.stream().distinct().collect(Collectors.toList());
    }

}
