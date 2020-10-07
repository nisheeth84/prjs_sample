package jp.co.softbrain.esales.commons.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.NotificationEmail;
import jp.co.softbrain.esales.commons.domain.NotificationSetting;
import jp.co.softbrain.esales.commons.repository.NotificationEmailRepository;
import jp.co.softbrain.esales.commons.repository.NotificationSettingRepository;
import jp.co.softbrain.esales.commons.repository.NotificationSettingRepositoryCustom;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.NotificationSettingService;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingResultDTO;
import jp.co.softbrain.esales.commons.service.dto.NotificationSettingDTO;
import jp.co.softbrain.esales.commons.service.mapper.NotificationDetailSettingMapper;
import jp.co.softbrain.esales.commons.service.mapper.NotificationSettingMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ValidateResponse;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Service Implementation for managing {@link NotificationSetting}.
 *
 * @author DatDV
 */
@Service
@Transactional
public class NotificationSettingServiceImpl implements NotificationSettingService {

    public static final String VALIDATE_FAILDED = "VALIDATE_FAILDED";
    public static final String GET_NOTIFICATION_SETTING = "getNotificationSetting";
    public static final String CREATE_NOTIFICATION_SETTING = "createNotificationSetting";
    public static final Long PARAM_SET_ONE = 1L;
    public static final Long PARAM_SET_ZERO = 0L;
    public static final String ERR_COM_0003 = "ERR_COM_0003";
    public static final String ERROR = "error";
    private static final String VALIDATE_FAIL = "validate fail";
    private static final String URL_API_VALIDATE = "validate";

    @Autowired
    private NotificationSettingRepository notificationSettingRepository;

    @Autowired
    private NotificationSettingRepositoryCustom notificationSettingRepositoryCustom;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private NotificationDetailSettingMapper notificationDetailSettingMapper;

    @Autowired
    private NotificationSettingMapper notificationSettingMapper;

    @Autowired
    private NotificationEmailRepository notificationEmailRepository;

    /**
     * Save a notificationSetting.
     *
     * @param notificationSettingDTO the DTO to save.
     * @return the persisted DTO.
     */
    @Override
    @Transactional
    public NotificationSettingDTO save(NotificationSettingDTO notificationSettingDTO) {
        NotificationSetting notificationSetting = notificationSettingMapper.toEntity(notificationSettingDTO);
        notificationSetting = notificationSettingRepository.save(notificationSetting);
        return notificationSettingMapper.toDto(notificationSetting);
    }

    /**
     * Get all the notificationSettings.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationSetting> findAll() {
        return notificationSettingRepository.findAll();
    }

    /**
     * Get one notificationSetting by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<NotificationSetting> findOne(Long id) {
        return notificationSettingRepository.findById(id);
    }

    /**
     * Delete the notificationSetting by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        notificationSettingRepository.deleteById(id);
    }

    /**
     * @see NotificationSettingService#getNotificationSetting(Long, Boolean)
     */
    @Override
    public GetNotificationSettingOutDTO getNotificationSetting(Long employeeId, Boolean isNotification) {
        // 1.1 Validate common
        if (employeeId == null || employeeId < 0) {
            employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        }

        // 1.2 get list notification information setting
        boolean isDefault = false;
        List<GetNotificationSettingResultDTO> result =
                notificationSettingRepositoryCustom.getNotificationSetting(employeeId, isNotification);
        if (result.isEmpty()) {
            isDefault = true;
            result = notificationSettingRepositoryCustom.getNotificationSettingDefault(isNotification);
        }

        // 1.3 create data response
        GetNotificationSettingOutDTO resultDto = new GetNotificationSettingOutDTO();
        if (!isDefault && !result.isEmpty()) {
            resultDto.setEmployeeId(employeeId);
            resultDto.setEmail(result.get(0).getEmail());
            resultDto.setNotificationTime(result.get(0).getNotificationTime());
        } else {
            resultDto.setEmail(jwtTokenUtil.getEmailFromToken());
            resultDto.setNotificationTime(0L);
            resultDto.setEmployeeId(0L);
        }

        resultDto.setData(result.stream()
                .map(dto -> notificationDetailSettingMapper.toGetNotificationSettingSubType1DTO(dto))
                .collect(Collectors.toList()));

        return resultDto;
    }

    /**
     *
     */
    @Override
    public CreateNotificationSettingOutDTO createNotificationSetting(Long employeeId, String email) {
        // 1.1 Validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();

        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("employeeId", employeeId);
        fixedParams.put("email", email);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
            URL_API_VALIDATE, HttpMethod.POST, new ValidateRequest(validateJson), ValidateResponse.class, token,
            jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomException(VALIDATE_FAIL, responseValidate.getErrors());
        }
        try {
            // 1.2 insert notification setting
            NotificationSettingDTO notificationSettingDTO = setParamNotificationSettingDTO(employeeId);
            this.save(notificationSettingDTO);

            //1.3 insert notification type setting - do it later

            // 1.4 insert notification detail setting - do it later

            // 1.5 insert notification email
            NotificationEmail notificationEmail = setParamNotificationEmail(employeeId, email);
            notificationEmailRepository.save(notificationEmail);
        } catch (Exception e) {
            throw new CustomException(ERROR, CREATE_NOTIFICATION_SETTING, ERR_COM_0003);
        }

        // 1.6 create data response
        CreateNotificationSettingOutDTO response = new CreateNotificationSettingOutDTO();
        response.setEmployeeId(employeeId);
        return response;
    }

    @Override
    public Optional<NotificationSettingDTO> findByEmployeeId(Long employeeId) {
        return Optional.ofNullable(notificationSettingMapper.toDto(notificationSettingRepository.findByEmployeeId(employeeId)));
    }

    /**
     * set Param Notification Setting DTO
     *
     * @param employeeId : employeeId for save
     * @return NotificationSettingDTO : DTO out of method
     */
    private NotificationSettingDTO setParamNotificationSettingDTO(Long employeeId) {
        NotificationSettingDTO notificationSettingDTO = new NotificationSettingDTO();
        notificationSettingDTO.setEmployeeId(employeeId);
        notificationSettingDTO.setDisplayNotificationSetting(PARAM_SET_ONE);
        notificationSettingDTO.setSaveNotificationSetting(PARAM_SET_ONE);
        notificationSettingDTO.setIsNotificationMail(true);
        notificationSettingDTO.setNotificationTime(PARAM_SET_ZERO);
        notificationSettingDTO.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        notificationSettingDTO.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        return notificationSettingDTO;
    }

    /**
     * set Param Notification Email
     *
     * @param employeeId
     * @param email
     * @return NotificationEmail domain out of method
     */
    private NotificationEmail setParamNotificationEmail(Long employeeId, String email) {
        NotificationEmail notificationEmail = new NotificationEmail();
        notificationEmail.setEmail(email);
        notificationEmail.setEmployeeId(employeeId);
        notificationEmail.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        notificationEmail.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        return notificationEmail;
    }
}
