package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

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
    private Integer notificationType;
    /**
     * notificationSubtype
     */
    private Integer notificationSubtype;

}
