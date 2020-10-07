package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateNotificationInSubType1DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationInSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1345235235235L;

    /**
     * senderId
     */
    private Long senderId;
    /**
     * notificationType
     */
    private int notificationType;
    /**
     * notificationSubtype
     */
    private int notificationSubtype;

}
