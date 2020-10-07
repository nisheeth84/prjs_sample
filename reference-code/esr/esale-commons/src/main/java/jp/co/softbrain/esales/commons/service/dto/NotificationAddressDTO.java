package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.commons.domain.NotificationAddress} entity.
 * 
 * @author QuangLV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationAddressDTO extends BaseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -7679290623025982349L;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The notificationId
     */
    private Long notificationId;

    /**
     * The createdNotificationDate
     */
    private Instant createdNotificationDate;

    /**
     * The confirmNotificationDate
     */
    private Instant confirmNotificationDate;
}
