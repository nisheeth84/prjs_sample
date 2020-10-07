package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jp.co.softbrain.esales.commons.config.ApplicationProperties;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import jp.co.softbrain.esales.commons.repository.NotificationsRepositoryCustom;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.NotificationSettingService;
import jp.co.softbrain.esales.commons.service.NotificationsService;
import jp.co.softbrain.esales.commons.service.dto.CountUnreadNotificationOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsResultDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsSubType1DTO;
import jp.co.softbrain.esales.commons.service.mapper.NotificationInformationMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;
import jp.co.softbrain.esales.utils.dto.commons.ValidateResponse;

/**
 * Notification Service Impl
 *
 * @author DatDV
 */
@Service
public class NotificationsServiceImpl implements NotificationsService {

    private static final Long NUMBER_ZERO = 0L;
    public static final String VALIDATE_FAIL = "VALIDATE_FAIL";
    public static final String GET_NOTIFICATIONS = "getNotifications";
    public static final String COUNT_UNREAD_NOTIFICATION = "countUnreadNotification";
    private static final String URL_API_VALIDATE = "validate";

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private NotificationSettingService notificationSettingService;

    @Autowired
    private NotificationsRepositoryCustom notificationsRepositoryCustom;

    @Autowired
    private NotificationInformationMapper notificationInformationMapper;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Override
    public GetNotificationsOutDTO getNotifications(Long employeeId, Long limit, String textSearch) {

        // 1.1 Validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();

        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("employeeId", employeeId);
        fixedParams.put("limit", limit);
        fixedParams.put("textSearch", textSearch);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        // json for validate common and call method validate common
        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_VALIDATE, HttpMethod.POST, new ValidateRequest(validateJson), ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomException(VALIDATE_FAIL, responseValidate.getErrors());
        }

        GetNotificationSettingOutDTO getNotificationSettingOutDTO = notificationSettingService
                .getNotificationSetting(employeeId, true);

        List<Long> notificationType = new ArrayList<>();
        List<Long> notificationSubtype = new ArrayList<>();

        for (GetNotificationSettingSubType1DTO getNotificationSettingSubType1DTO : getNotificationSettingOutDTO
                .getData()) {
            notificationType.add(getNotificationSettingSubType1DTO.getNotificationType());
            notificationSubtype.add(getNotificationSettingSubType1DTO.getNotificationSubtype());
        }

        List<GetNotificationsResultDTO> resultListNotifications = notificationsRepositoryCustom
                .getNotifications(employeeId, limit, textSearch, notificationType, notificationSubtype);

        List<GetNotificationsSubType1DTO> responseLst = new ArrayList<>();
        for (GetNotificationsResultDTO getNotificationsResultDTO : resultListNotifications) {
            GetNotificationsSubType1DTO getNotificationsSubType1DTO = notificationInformationMapper.toGetNotificationsSubType1DTO(getNotificationsResultDTO);
            getNotificationsSubType1DTO.setIcon(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket() , getNotificationsResultDTO.getIcon() , applicationProperties.getExpiredSeconds()));
            responseLst.add(getNotificationsSubType1DTO);
        }
        // 1.4 create data response
        GetNotificationsOutDTO response = new GetNotificationsOutDTO();
        response.setEmployeeId(employeeId);
        response.setData(responseLst);
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      {@link NotificationsService#countUnreadNotification(Long)}
     */
    @Override
    public CountUnreadNotificationOutDTO countUnreadNotification(Long employeeId) {
        CountUnreadNotificationOutDTO response = new CountUnreadNotificationOutDTO();
        // 1. Call API validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();

        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("employeeId", employeeId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_VALIDATE, HttpMethod.POST, new ValidateRequest(validateJson), ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomException(VALIDATE_FAIL, responseValidate.getErrors());
        }
        // 2. Call getNotifications
        GetNotificationsOutDTO resultListNotifications = this.getNotifications(employeeId, null, null);

        // 3. Count NotificationsOf
        long count = 0;
        if (resultListNotifications.getData().isEmpty()) {
            response.setUnreadNotificationNumber(NUMBER_ZERO);
        } else {

            for (GetNotificationsSubType1DTO getNotificationsSubType1DTO : resultListNotifications.getData()) {
                if (getNotificationsSubType1DTO.getConfirmNotificationDate() == null) {
                    count++;
                }
            }
            response.setUnreadNotificationNumber(count);
        }
        // 4. Create response
        return response;
    }
}
