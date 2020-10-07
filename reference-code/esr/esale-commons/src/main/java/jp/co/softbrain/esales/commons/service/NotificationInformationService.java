package jp.co.softbrain.esales.commons.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType6DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType7DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType8DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType9DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationResponse;

/**
 * NotificationInformationService
 *
 * @author lequyphuc
 */
@XRayEnabled
public interface NotificationInformationService {

    /**
     * create Notification
     *
     * @param dataNotification data notification get from request
     * @param dateTimelines data get from timeline service
     * @param activite data get from activity service
     * @param customer data get from customer service
     * @param businessCards data get from businesscard service
     * @param dataCalendar data get from schedules service
     * @param imports data import get from request
     * @return CreateNotificationResponse response
     */
    public List<Long> createNotification(CreateNotificationInSubType1DTO dataNotification,
            CreateNotificationInSubType2DTO dateTimelines, CreateNotificationInSubType3DTO activite,
            List<CreateNotificationInSubType6DTO> customer, List<CreateNotificationInSubType7DTO> businessCards,
            List<CreateNotificationInSubType8DTO> dataCalendar, CreateNotificationInSubType9DTO imports);
}
