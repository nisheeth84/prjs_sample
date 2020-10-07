package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
public class GetNotificationSettingSubType1DTO implements Serializable {

    private static final long serialVersionUID = 7244370969986640221L;

    private Long notificationType;

    private Long notificationSubtype;

    private String notificationSubtypeName;

    private Boolean isNotification;
}
