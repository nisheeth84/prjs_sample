package jp.co.softbrain.esales.commons.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;

import jp.co.softbrain.esales.commons.domain.NotificationAddress;
import jp.co.softbrain.esales.commons.domain.NotificationInformation;
import jp.co.softbrain.esales.commons.domain.PushNotification;
import jp.co.softbrain.esales.commons.repository.NotificationAddressRepository;
import jp.co.softbrain.esales.commons.repository.NotificationInformationRepository;
import jp.co.softbrain.esales.commons.repository.PushNotificationRepository;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.AmazonSNSPublisherService;
import jp.co.softbrain.esales.commons.service.NotificationInformationService;
import jp.co.softbrain.esales.commons.service.NotificationSettingService;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType6DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType7DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType8DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType9DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationOutSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.employees.EmployeeResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.employees.GetEmployeeRequest;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * NotificationInformationServiceImpl
 *
 * @author lequyphuc
 */
@Service
public class NotificationInformationServiceImpl implements NotificationInformationService {
    private final Logger log = LoggerFactory.getLogger(NotificationInformationServiceImpl.class);

    private static final String VALIDATE_MSG_FAILED = "validated fail";
    @Autowired
    private ValidateService validateService;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private NotificationInformationRepository notificationInformationRepository;
    @Autowired
    private NotificationSettingService notificationSettingService;
    @Autowired
    private Gson gson;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private NotificationAddressRepository notificationAddressRepository;

    @Autowired

    private JwtTokenUtil jwtTokenUtil;

    // @Autowired
    private AmazonSNSPublisherService amazonSNSPublisherService;

    @Autowired
    private PushNotificationRepository pushNotificationRepository;

    private static final Map<String, String> notificationCode = listNotification();
    private static final String REGISACTIVITY_MYSELF = "310";
    private static final String REGISACTIVITY_CUSTOMER = "320";
    private static final String REGISACTIVITY_BUSINESSCARD = "330";
    private static final String ZERO = "0";

    private static Map<String, String> listNotification() {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("110", "mypost.post.register");
        mapping.put("111", "mypost.comment.register");
        mapping.put("120", "mypost.react");
        mapping.put("130", "mypost.comment");
        mapping.put("140", "mypost.comment.add");
        mapping.put("210", "groupPost.post");
        mapping.put("211", "groupPost.comment");
        mapping.put("310", "regisActivity.myself");
        mapping.put("320", "regisActivity.customer");
        mapping.put("330", "regisActivity.businessCard");
        mapping.put("410", "regisCustomer.customer.regis");
        mapping.put("411", "regisCustomer.customer.update");
        mapping.put("412", "regisCustomer.customer.delete");
        mapping.put("420", "regisCustomer.trade.update");
        mapping.put("510", "regisBusinessCard.regis");
        mapping.put("511", "regisBusinessCard.update");
        mapping.put("512", "regisBusinessCard.delete");
        mapping.put("610", "regisSchedule.regis");
        mapping.put("611", "regisSchedule.update");
        mapping.put("612", "regisSchedule.delete");
        mapping.put("710", "regisTask.regis");
        mapping.put("711", "regisTask.update");
        mapping.put("712", "regisTask.delete");
        mapping.put("810", "regisMileStome.regis");
        mapping.put("811", "regisMileStome.update");
        mapping.put("812", "regisMileStome.delete");
        mapping.put("910", "notificationTask.will.enjoy");
        mapping.put("920", "notificationTask.start.task");
        mapping.put("930", "notificationTask.end.milestone");
        mapping.put("1110", "complete.import.end.import");
        mapping.put("1120", "complete.import.end.update");
        return mapping;
    }

    private static final String PUSH_NOTIFICATION_FORMAT_MESSAGE = "{\r\n"
            + "  \"GCM\":\"{ \\\"notification\\\": { \\\"body\\\": \\\"%s\\\", \\\"title\\\":\\\"%s\\\" }, \\\"data\\\": {\\\"time_to_live\\\": 3600,\\\"collapse_key\\\":\\\"deals\\\"} }\"\r\n"
            + "}";

    /**
     * @see jp.co.softbrain.esales.commons.service.NotificationInformationService#createNotification(jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType1DTO,
     *      jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType2DTO,
     *      jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType3DTO,
     *      java.util.List, java.util.List, java.util.List,
     *      jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType9DTO)
     */
    @Override
    @Transactional
    public List<Long> createNotification(CreateNotificationInSubType1DTO dataNotification,
            CreateNotificationInSubType2DTO dateTimelines, CreateNotificationInSubType3DTO activite,
            List<CreateNotificationInSubType6DTO> customer, List<CreateNotificationInSubType7DTO> businessCards,
            List<CreateNotificationInSubType8DTO> dataCalendar, CreateNotificationInSubType9DTO imports) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        Integer notificationType = dataNotification.getNotificationType();
        Integer notificationSubType = dataNotification.getNotificationSubtype();
        Map<Integer, Object> mapping = new HashMap<>();
        mapping.put(1, dateTimelines);
        mapping.put(2, dateTimelines);
        mapping.put(3, activite);
        mapping.put(4, customer);
        mapping.put(5, businessCards);
        mapping.put(6, dataCalendar);
        mapping.put(7, dataCalendar);
        mapping.put(8, dataCalendar);
        mapping.put(9, dataCalendar);
        mapping.put(11, imports);
        // 1.1.Validate Param
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        switch (notificationType) {
        case 1:
        case 2:
        case 3:
        case 11:
            fixedParams.putAll(jsonBuilder.convertObject(mapping.get(notificationType)));
            break;
        case 4:
            customer.forEach(e -> fixedParams.putAll(jsonBuilder.convertObject(e)));
            break;
        case 5:
            businessCards.forEach(e -> fixedParams.putAll(jsonBuilder.convertObject(e)));
            break;
        case 6:
        case 7:
        case 8:
        case 9:
            dataCalendar.forEach(e -> fixedParams.putAll(jsonBuilder.convertObject(e)));
            break;
        default:
            break;
        }
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> validateResponse = validateService.validate(validateJson);
        if (validateResponse != null && !validateResponse.isEmpty()) {
            throw new CustomException(VALIDATE_MSG_FAILED, validateResponse);
        }
        // 1.2.call api getNotificationSetting
        boolean check = false;
        List<GetNotificationSettingSubType1DTO> datas = notificationSettingService
                .getNotificationSetting(employeeId, true).getData();
        for (GetNotificationSettingSubType1DTO data : datas) {
            if (notificationType.equals(data.getNotificationType().intValue())
                    && notificationSubType.equals(data.getNotificationSubtype().intValue())) {
                check = true;
                break;
            }
        }
        if (!check)
            return null;
        // 1.2.Get information sender notification
        String senderName = null;
        String senderIcon = "";
        GetEmployeeRequest req = new GetEmployeeRequest(dataNotification.getSenderId(), "edit");

        EmployeeResponseDTO employeeRes = restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES,
                "get-employee", HttpMethod.POST, req, EmployeeResponseDTO.class,
                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());

        if (employeeRes != null) {
            senderName = employeeRes.getData().getEmployeeSurname();
            if (employeeRes.getData() != null) {
                senderName += " " + employeeRes.getData().getEmployeeName();
                senderIcon = employeeRes.getData().getEmployeeIcon() != null
                        ? employeeRes.getData().getEmployeeIcon().getFilePath()
                        : null;
            }
        }

        String senderNameCoppy = senderName;
        String senderIcon1 = senderIcon;
        String languageCode = jwtTokenUtil.getLanguageKeyFromToken();
        Locale locale = Locale.forLanguageTag(languageCode);
        List<NotificationInformation> notificationList = new ArrayList<>();
        final String mode = String.valueOf(notificationType) + String.valueOf(notificationSubType);
        String modeZero = mode + ZERO;
        List<Long> receiveIds = new ArrayList<>();
        Map<Long, CreateNotificationOutSubType1DTO> res = new HashMap<>();
        switch (notificationType) {
        case 1:
            dateTimelines.getReceivers().forEach(e -> {
                String messageTimeLine = convertToJsonB(languageCode,
                        messageSource.getMessage(notificationCode.get(mode + String.valueOf(dateTimelines.getMode())),
                                new Object[] { senderNameCoppy, e.getReceiverName() }, locale));
                receiveIds.add(e.getReceiverId());
                notificationList.add(new NotificationInformation(null, null, null, dateTimelines.getValueId(), null,
                        null, null, null, null, null, null, messageTimeLine, null, null));
                makeNotification(Arrays.asList(e.getReceiverId()), messageTimeLine, res);
            });
            break;
        case 2:
            dateTimelines.getReceivers().forEach(e -> receiveIds.add(e.getReceiverId()));
            String messageTimeLine = convertToJsonB(languageCode,
                    messageSource.getMessage(notificationCode.get(mode + String.valueOf(dateTimelines.getMode())),
                            new Object[] { senderNameCoppy, dateTimelines.getValueName() }, locale));
            notificationList.add(new NotificationInformation(null, null, null, dateTimelines.getValueId(), null, null,
                    null, null, null, null, null, messageTimeLine, null, null));
            makeNotification(receiveIds, messageTimeLine, res);
            break;
        case 3:
            activite.getReceivers().forEach(e -> receiveIds.add(e.getReceiverId()));
            for (int i = 0; i < activite.getCustomers().size(); i++) {
                String message = "";
                switch (modeZero) {
                case REGISACTIVITY_MYSELF:
                    message = convertToJsonB(languageCode, messageSource.getMessage(
                            notificationCode.get(REGISACTIVITY_MYSELF), new Object[] { senderName }, locale));
                    break;
                case REGISACTIVITY_CUSTOMER:
                    message = convertToJsonB(languageCode,
                            messageSource.getMessage(notificationCode.get(REGISACTIVITY_CUSTOMER),
                                    new Object[] { activite.getCustomers().get(i).getCustomerName(), senderNameCoppy },
                                    locale));
                    break;
                case REGISACTIVITY_BUSINESSCARD:
                    message = convertToJsonB(languageCode,
                            messageSource.getMessage(notificationCode.get(REGISACTIVITY_BUSINESSCARD),
                                    new Object[] { activite.getBusinessCards().get(i).getBusinessCardName(),
                                            activite.getBusinessCards().get(i).getCompanyName() },
                                    locale));
                    break;
                default:
                    break;
                }
                makeNotification(receiveIds, message, res);
                notificationList.add(new NotificationInformation(null, null, null, null, activite.getActivityId(),
                        activite.getCustomers().get(i).getCustomerId(),
                        activite.getBusinessCards().get(i).getBusinessCardId(), null, null, null, null, message, null,
                        null));
            }
            break;
        case 4:
            customer.forEach(e -> {
                String message = convertToJsonB(languageCode,
                        messageSource
                                .getMessage(notificationCode.get(mode + String.valueOf(e.getCustomerMode())),
                                        new Object[] { notificationSubType == 2 ? e.getCustomerName() : senderNameCoppy,
                                                notificationSubType == 2 ? senderNameCoppy : e.getCustomerName() },
                                        locale));
                List<Long> reciverIdThis = new ArrayList<>();
                notificationList.add(new NotificationInformation(null, null, null, null, null, e.getCustomerId(), null,
                        null, null, null, null, message, null, null));
                e.getReceivers().forEach(k -> {
                    receiveIds.add(k.getReceiverId());
                    reciverIdThis.add(k.getReceiverId());
                });
                makeNotification(reciverIdThis, message, res);

            });
            break;
        case 5:
            businessCards.forEach(e -> {
                List<Long> reciverIdThis = new ArrayList<>();
                e.getReceivers().forEach(k -> {
                    receiveIds.add(k.getReceiverId());
                    reciverIdThis.add(k.getReceiverId());
                });
                String message = convertToJsonB(languageCode,
                        messageSource.getMessage(notificationCode.get(mode + String.valueOf(e.getModeBusinessCard())),
                                new Object[] { senderNameCoppy, e.getBusinessCardName(), e.getCompanyName() }, locale));
                notificationList.add(new NotificationInformation(null, null, null, null, null, null,
                        e.getBusinessCardId(), null, null, null, null, message, null, null));
                makeNotification(reciverIdThis, message, res);
            });
            break;
        case 6:
        case 7:
        case 8:
            dataCalendar.forEach(e -> {
                String calendarMode = mode + String.valueOf(e.getMode());
                receiveIds.addAll(e.getReceiverIds());
                NotificationInformation notification = new NotificationInformation();
                switch (notificationType) {
                case 6:
                    notification.setScheduleId(e.getValueId());
                    break;
                case 7:
                    notification.setTaskId(e.getValueId());
                    break;
                case 8:
                    notification.setMilestoneId(e.getValueId());
                    break;
                default:
                    break;
                }
                String message = convertToJsonB(languageCode,
                        messageSource.getMessage(notificationCode.get(calendarMode),
                                new Object[] { senderNameCoppy, e.getValueName() }, locale));
                notification.setMessage(message);
                makeNotification(e.getReceiverIds(), message, res);
                notificationList.add(notification);
            });
            break;
        case 9:
            dataCalendar.forEach(e -> {
                String messageCalendar = convertToJsonB(languageCode,
                        messageSource.getMessage(notificationCode.get(modeZero),
                                new Object[] { notificationSubType == 3 ? e.getValueName() : e.getStartDate(),
                                        e.getEndDate(), e.getValueName() },
                                locale));
                receiveIds.addAll(e.getReceiverIds());
                notificationList.add(new NotificationInformation(null, null, null, null, null, null, null, null, null,
                        e.getValueId(), null, messageCalendar, null, null));
                makeNotification(e.getReceiverIds(), messageCalendar, res);
            });
            break;
        case 10:
            break;
        case 11:
            receiveIds.addAll(imports.getReceiverIds());
            String message = convertToJsonB(languageCode,
                    messageSource.getMessage(notificationCode.get(mode + imports.getImportMode()),
                            new Object[] { imports.getImportId() }, locale));
            notificationList.add(new NotificationInformation(null, null, null, null, null, null, null, null, null, null,
                    imports.getImportId(), message, null, null));
            makeNotification(receiveIds, message, res);
            break;
        default:
            break;
        }
        notificationList.forEach(e -> {
            e.setNotificationType(Long.valueOf(dataNotification.getNotificationType()));
            e.setNotificationSubtype(Long.valueOf(dataNotification.getNotificationSubtype()));
            e.setIcon(senderIcon1);
            e.setNotificationSender(senderNameCoppy);
            e.setCreatedUser(employeeId);
            e.setUpdatedUser(employeeId);

        });
        Map<Long, String> messageMapping = new HashMap<>();
        notificationInformationRepository.saveAll(notificationList)
                .forEach(e -> messageMapping.put(e.getNotificationId(), e.getMessage()));
        // 1.4.Insert into notification_address
        for (CreateNotificationOutSubType1DTO value : res.values()) {
            for (String mess : value.getMessages()) {
                NotificationAddress entity = new NotificationAddress();
                entity.setEmployeeId(value.getReciverId());
                for (Map.Entry<Long, String> entry : messageMapping.entrySet()) {
                    if (entry.getValue().equals(mess)) {
                        entity.setNotificationId(entry.getKey());
                        break;
                    }
                }
                entity.setCreatedNotificationDate(Instant.now());
                entity.setCreatedUser(employeeId);
                entity.setUpdatedUser(employeeId);
                notificationAddressRepository.save(entity).getNotificationId();
            }

        }
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        for (CreateNotificationOutSubType1DTO item : res.values()) {
            List<PushNotification> pushNotifications = pushNotificationRepository
                    .getPushNotificationFromEmployeeId(item.getReciverId());
            if (pushNotifications != null && pushNotifications.size() > 0) {
                for (int i = 0; i < pushNotifications.size(); i++) {
                    PushNotification pushNotification = pushNotifications.get(i);
                    if (!pushNotification.getEmployeeId().equals(item.getReciverId()) || !pushNotification.getIsLogged()
                            || !pushNotification.getTenantId().equals(tenant)) {
                        continue;
                    }
                    item.getMessages().forEach(messageJson -> {
                        try {
                            JSONObject jsonObject = new JSONObject(messageJson);
                            String message = (String) jsonObject.get(languageCode);
                            amazonSNSPublisherService.publish(
                                    String.format(PUSH_NOTIFICATION_FORMAT_MESSAGE, message, "esm"),
                                    pushNotification.getEndpoint());
                        } catch (JSONException e1) {
                            log.error("Send PushNotification Error", e1);
                        }
                    });
                }
            }
        }
        return new ArrayList<>(messageMapping.keySet());
    }

    private void makeNotification(List<Long> reciverIds, String message,
            Map<Long, CreateNotificationOutSubType1DTO> res) {
        for (Long e : reciverIds) {
            if (!res.keySet().contains(e)) {
                res.put(e, new CreateNotificationOutSubType1DTO());
            }
            res.get(e).getMessages().add(message);
            if (res.get(e).getReciverId() != null) {
                continue;
            }
            res.get(e).setReciverId(e);
        }

    }

    /**
     * convert To JsonB
     *
     * @param key
     * @param message
     * @return
     */
    private String convertToJsonB(String key, String message) {
        Map<String, String> mapping = new HashMap<>();
        mapping.put(key, message);
        return gson.toJson(mapping);
    }
}
