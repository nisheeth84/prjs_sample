package jp.co.softbrain.esales.commons.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.util.CollectionUtils;

import jp.co.softbrain.esales.commons.domain.NotificationDetailSetting;
import jp.co.softbrain.esales.commons.domain.NotificationEmail;
import jp.co.softbrain.esales.commons.domain.NotificationTypeSetting;
import jp.co.softbrain.esales.commons.repository.NotificationDetailSettingRepository;
import jp.co.softbrain.esales.commons.repository.NotificationTypeSettingRepository;
import jp.co.softbrain.esales.commons.service.NotificationDetailSettingService;
import jp.co.softbrain.esales.commons.service.NotificationEmailService;
import jp.co.softbrain.esales.commons.service.NotificationSettingService;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.service.dto.DataSettingNotificationDTO;
import jp.co.softbrain.esales.commons.service.dto.DataSettingNotificationWithSubTypeNameDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.NotificationSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateNotificationDetailSettingOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;

/**
 * Service Implementation for managing {@link NotificationDetailSetting}.
 *
 * @author QuangLV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class NotificationDetailSettingServiceImpl implements NotificationDetailSettingService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private NotificationTypeSettingRepository notificationTypeSettingRepository;

    @Autowired
    private NotificationDetailSettingRepository notificationDetailSettingRepository;

    @Autowired
    private NotificationEmailService notificationEmailService;

    @Autowired
    private NotificationSettingService notificationSettingService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ValidateService validateService;

    private static final String VALIDATE_FAIL = "validate fail";

    private static final String ERR_COM_0003 = "ERR_COM_0003";

    /**
     * function constructor of class NotificationDetailSettingServiceImpl
     *
     * @param notificationDetailSettingRepository :
     *        NotificationDetailSettingRepository
     */
    public NotificationDetailSettingServiceImpl(
            NotificationDetailSettingRepository notificationDetailSettingRepository) {
        this.notificationDetailSettingRepository = notificationDetailSettingRepository;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationDetailSettingService#save(jp.co.softbrain.esales.commons.domain.NotificationDetailSetting)
     */
    @Override
    @Transactional
    public NotificationDetailSetting save(NotificationDetailSetting notificationDetailSetting) {
        return notificationDetailSettingRepository.save(notificationDetailSetting);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationDetailSettingService#findAll()
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationDetailSetting> findAll() {
        return notificationDetailSettingRepository.findAll();
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationDetailSettingService#findOne(Long)
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<NotificationDetailSetting> findOne(Long id) {
        return notificationDetailSettingRepository.findById(id);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationDetailSettingService#delete(Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        notificationDetailSettingRepository.deleteById(id);
    }

    /**
     * @see NotificationDetailSettingService#updateNotificationDetailSetting(Long,
     *      List, Long, List)
     */
    @Override
    @Transactional
    public UpdateNotificationDetailSettingOutDTO updateNotificationDetailSetting(Long paramEmployeeId,
            List<DataSettingNotificationDTO> dataSettingNotifications, Long notificationTime, List<String> emails) {

        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        Long employeeId = Optional.ofNullable(paramEmployeeId).orElse(userId);

        // 1. Validate parameter
        validateObligatory(dataSettingNotifications, notificationTime, emails);

        validateCommonParameter(dataSettingNotifications, notificationTime, emails);
        try {
            // 2. GetNotificationSetting
            GetNotificationSettingOutDTO notificationSettingResponse = notificationSettingService
                    .getNotificationSetting(employeeId, null);

            if (notificationSettingResponse.getEmployeeId() == 0) {
                // 3. Create data
                // 3.1 notification_setting
                NotificationSettingDTO notificationSetting = new NotificationSettingDTO();
                notificationSetting.setEmployeeId(employeeId);
                notificationSetting.setDisplayNotificationSetting(1L);
                notificationSetting.setSaveNotificationSetting(1L);
                notificationSetting.setIsNotificationMail(true);
                notificationSetting.setNotificationTime(0L);
                notificationSetting.setCreatedUser(userId);
                notificationSetting.setUpdatedUser(userId);
                notificationSettingService.save(notificationSetting);

                List<DataSettingNotificationWithSubTypeNameDTO> dataList = createDataSettingNotifications();

                // 3.2 notification_type_setting
                List<Long> notificationTypes = dataList.stream()
                        .map(DataSettingNotificationWithSubTypeNameDTO::getNotificationType).distinct()
                        .collect(Collectors.toList());

                notificationTypes.forEach(type -> {
                    NotificationTypeSetting notificationTypeSetting = new NotificationTypeSetting();
                    notificationTypeSetting.setEmployeeId(employeeId);
                    notificationTypeSetting.setNotificationType(type);
                    notificationTypeSetting.setCreatedUser(userId);
                    notificationTypeSetting.setUpdatedUser(userId);
                    notificationTypeSettingRepository.save(notificationTypeSetting);
                });

                // 3.3 notification_detail_setting
                dataList.forEach(data -> {
                    NotificationDetailSetting notificationDetailSetting = new NotificationDetailSetting();
                    notificationDetailSetting.setEmployeeId(employeeId);
                    notificationDetailSetting.setNotificationType(data.getNotificationType());
                    notificationDetailSetting.setNotificationSubtype(data.getNotificationSubtype());
                    notificationDetailSetting.setIsNotification(data.getIsNotification());
                    notificationDetailSetting.setNotificationSubtypeName(data.getNotificationSubtypeName());
                    notificationDetailSetting.setSettingNotificationDate(Instant.now());
                    notificationDetailSetting.setCreatedUser(userId);
                    notificationDetailSetting.setUpdatedUser(userId);
                    save(notificationDetailSetting);
                });

                // 3.4 notification_email
                NotificationEmail notificationEmail = new NotificationEmail();
                notificationEmail.setEmployeeId(employeeId);
                notificationEmail.setEmail(String.join(";", emails));
                notificationEmail.setCreatedUser(userId);
                notificationEmail.setUpdatedUser(userId);
                notificationEmailService.save(notificationEmail);
            }

            // 4. update notification_detail_setting
            dataSettingNotifications.forEach(data -> {
                NotificationDetailSetting notificationDetailSetting = notificationDetailSettingRepository
                        .findByEmployeeIdAndNotificationTypeAndNotificationSubtype(employeeId,
                                data.getNotificationType(), data.getNotificationSubtype())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Notification detail setting of employee(" + employeeId + ") not exist."));
                notificationDetailSetting.setIsNotification(data.getIsNotification());
                notificationDetailSetting.setSettingNotificationDate(Instant.now());
                notificationDetailSetting.setUpdatedUser(userId);
                save(notificationDetailSetting);
            });

            // 5. update email
            NotificationEmail notificationEmail = notificationEmailService.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee(" + employeeId + ")'s email not exist."));
            notificationEmail.setEmail(String.join(";", emails));
            notificationEmail.setUpdatedUser(userId);
            notificationEmailService.save(notificationEmail);

            // 6. update notification_setting
            NotificationSettingDTO notificationSetting = notificationSettingService.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Notification setting of employee(" + employeeId + ") not exist."));
            notificationSetting.setNotificationTime(notificationTime);
            notificationSetting.setUpdatedUser(userId);
            notificationSettingService.save(notificationSetting);

            return new UpdateNotificationDetailSettingOutDTO(employeeId);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError("update notification", ERR_COM_0003));
        }
    }

    /**
     * validateObligatory : validate obligatory
     *
     * @param dataSettingNotifications : List {@link DataSettingNotificationDTO}
     * @param notificationTime : notification time
     * @param emails : List email
     */
    private void validateObligatory(List<DataSettingNotificationDTO> dataSettingNotifications, Long notificationTime,
            List<String> emails) {
        if (CollectionUtils.isNullOrEmpty(dataSettingNotifications)) {
            throw new CustomRestException(CommonUtils.putError("dataSettingNotifications", Constants.RIQUIRED_CODE));
        }
        dataSettingNotifications.forEach(data -> {
            if (data.getNotificationType() == null) {
                throw new CustomRestException(CommonUtils.putError("notificationType", Constants.RIQUIRED_CODE));
            }
            if (data.getNotificationSubtype() == null) {
                throw new CustomRestException(CommonUtils.putError("notificationSubtype", Constants.RIQUIRED_CODE));
            }
            if (data.getIsNotification() == null) {
                throw new CustomRestException(CommonUtils.putError("isNotification", Constants.RIQUIRED_CODE));
            }
        });

        if (notificationTime == null) {
            throw new CustomRestException(CommonUtils.putError("notificationTime", Constants.RIQUIRED_CODE));
        }
        if (CollectionUtils.isNullOrEmpty(emails)) {
            throw new CustomRestException(CommonUtils.putError("emails", Constants.RIQUIRED_CODE));
        }
    }

    /**
     * validateCommonParameter : call API validate common
     *
     * @param dataSettingNotifications : List {@link DataSettingNotificationDTO}
     * @param notificationTime : notification time
     * @param emails : List email
     */
    private void validateCommonParameter(List<DataSettingNotificationDTO> dataSettingNotifications,
            Long notificationTime, List<String> emails) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        dataSettingNotifications.forEach(data -> fixedParams.putAll(jsonBuilder.convertObject(data)));
        fixedParams.put("notificationTime", notificationTime);
        fixedParams.put("emails", emails);
        List<Map<String, Object>> errors = validateService
                .validate(jsonBuilder.build(null, fixedParams, (Map<String, Object>) null));
        if (errors != null && !errors.isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, errors);
        }
    }

    /**
     * Create data setting notification
     *
     * @return List data
     */
    private List<DataSettingNotificationWithSubTypeNameDTO> createDataSettingNotifications() {
        List<DataSettingNotificationWithSubTypeNameDTO> dataList = new ArrayList<>();

        DataSettingNotificationWithSubTypeNameDTO data11 = new DataSettingNotificationWithSubTypeNameDTO();
        data11.setNotificationType(1L);
        data11.setNotificationSubtype(1L);
        data11.setNotificationSubtypeName("投稿・コメントの宛先に指定された場合");
        data11.setIsNotification(false);
        dataList.add(data11);

        DataSettingNotificationWithSubTypeNameDTO data12 = new DataSettingNotificationWithSubTypeNameDTO();
        data12.setNotificationType(1L);
        data12.setNotificationSubtype(2L);
        data12.setNotificationSubtypeName("自分の投稿に対してリアクションがついた場合");
        data12.setIsNotification(false);
        dataList.add(data12);

        DataSettingNotificationWithSubTypeNameDTO data13 = new DataSettingNotificationWithSubTypeNameDTO();
        data13.setNotificationType(1L);
        data13.setNotificationSubtype(3L);
        data13.setNotificationSubtypeName("自分の投稿に対してコメントされた場合");
        data13.setIsNotification(false);
        dataList.add(data13);

        DataSettingNotificationWithSubTypeNameDTO data14 = new DataSettingNotificationWithSubTypeNameDTO();
        data14.setNotificationType(1L);
        data14.setNotificationSubtype(4L);
        data14.setNotificationSubtypeName("自分がコメントした投稿に、追加でコメントがあった場合");
        data14.setIsNotification(false);
        dataList.add(data14);

        DataSettingNotificationWithSubTypeNameDTO data21 = new DataSettingNotificationWithSubTypeNameDTO();
        data21.setNotificationType(2L);
        data21.setNotificationSubtype(1L);
        data21.setIsNotification(true);
        dataList.add(data21);

        DataSettingNotificationWithSubTypeNameDTO data31 = new DataSettingNotificationWithSubTypeNameDTO();
        data31.setNotificationType(3L);
        data31.setNotificationSubtype(1L);
        data31.setIsNotification(true);
        dataList.add(data31);

        DataSettingNotificationWithSubTypeNameDTO data41 = new DataSettingNotificationWithSubTypeNameDTO();
        data41.setNotificationType(4L);
        data41.setNotificationSubtype(1L);
        data41.setIsNotification(true);
        dataList.add(data41);

        DataSettingNotificationWithSubTypeNameDTO data42 = new DataSettingNotificationWithSubTypeNameDTO();
        data42.setNotificationType(4L);
        data42.setNotificationSubtype(2L);
        data42.setIsNotification(true);
        dataList.add(data42);

        DataSettingNotificationWithSubTypeNameDTO data43 = new DataSettingNotificationWithSubTypeNameDTO();
        data43.setNotificationType(4L);
        data43.setNotificationSubtype(3L);
        data43.setIsNotification(true);
        dataList.add(data43);

        DataSettingNotificationWithSubTypeNameDTO data51 = new DataSettingNotificationWithSubTypeNameDTO();
        data51.setNotificationType(5L);
        data51.setNotificationSubtype(1L);
        data51.setIsNotification(true);
        dataList.add(data51);

        DataSettingNotificationWithSubTypeNameDTO data52 = new DataSettingNotificationWithSubTypeNameDTO();
        data52.setNotificationType(5L);
        data52.setNotificationSubtype(2L);
        data52.setIsNotification(true);
        dataList.add(data52);

        DataSettingNotificationWithSubTypeNameDTO data61 = new DataSettingNotificationWithSubTypeNameDTO();
        data61.setNotificationType(6L);
        data61.setNotificationSubtype(1L);
        data61.setNotificationSubtypeName("自分が参加者に設定されたスケジュールが登録・更新された場合");
        data61.setIsNotification(false);
        dataList.add(data61);

        DataSettingNotificationWithSubTypeNameDTO data71 = new DataSettingNotificationWithSubTypeNameDTO();
        data71.setNotificationType(7L);
        data71.setNotificationSubtype(1L);
        data71.setNotificationSubtypeName("自分が担当者に設定されたタスクが登録・更新された投稿があった場合");
        data71.setIsNotification(false);
        dataList.add(data71);

        DataSettingNotificationWithSubTypeNameDTO data81 = new DataSettingNotificationWithSubTypeNameDTO();
        data81.setNotificationType(8L);
        data81.setNotificationSubtype(1L);
        data81.setIsNotification(true);
        dataList.add(data81);

        DataSettingNotificationWithSubTypeNameDTO data91 = new DataSettingNotificationWithSubTypeNameDTO();
        data91.setNotificationType(9L);
        data91.setNotificationSubtype(1L);
        data91.setNotificationSubtypeName("schedule");
        data91.setIsNotification(false);
        dataList.add(data91);

        DataSettingNotificationWithSubTypeNameDTO data92 = new DataSettingNotificationWithSubTypeNameDTO();
        data92.setNotificationType(9L);
        data92.setNotificationSubtype(2L);
        data92.setNotificationSubtypeName("milestone");
        data92.setIsNotification(false);
        dataList.add(data92);

        DataSettingNotificationWithSubTypeNameDTO data93 = new DataSettingNotificationWithSubTypeNameDTO();
        data93.setNotificationType(9L);
        data93.setNotificationSubtype(3L);
        data93.setNotificationSubtypeName("task");
        data93.setIsNotification(false);
        dataList.add(data93);

        // notification_type = 10 pending, not used

        DataSettingNotificationWithSubTypeNameDTO data111 = new DataSettingNotificationWithSubTypeNameDTO();
        data111.setNotificationType(11L);
        data111.setNotificationSubtype(1L);
        data111.setNotificationSubtypeName("シミュレーション/インポート完了による投稿があった場合");
        data111.setIsNotification(false);
        dataList.add(data111);

        DataSettingNotificationWithSubTypeNameDTO data112 = new DataSettingNotificationWithSubTypeNameDTO();
        data112.setNotificationType(11L);
        data112.setNotificationSubtype(2L);
        data112.setNotificationSubtypeName("シミュレーション/インポート完了による投稿があった場合");
        data112.setIsNotification(false);
        dataList.add(data112);

        return dataList;
    }
}
