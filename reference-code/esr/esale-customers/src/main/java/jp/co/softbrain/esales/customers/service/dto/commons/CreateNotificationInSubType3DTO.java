package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType3DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType3DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 17347838586L;

    /**
     * activityId
     */
    private Long activityId;

    /**
     * customers
     */

    private List<CreateNotificationInSubType4DTO> customers;
    /**
     * receivers
     */

    private List<ReceiverDTO> receivers;

    /**
     * businessCards
     */

    private List<CreateNotificationInSubType5DTO> businessCards;

}
