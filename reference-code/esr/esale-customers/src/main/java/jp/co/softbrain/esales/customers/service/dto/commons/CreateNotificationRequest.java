package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateNotificationRequest
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateNotificationRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 525237647571L;

    /**
     * dataNotification
     */
    private CreateNotificationInSubType1DTO dataNotification;
    /**
     * dateTimelines
     */
    private CreateNotificationInSubType2DTO dateTimelines;
    /**
     * activite
     */
    private CreateNotificationInSubType3DTO activite;
    /**
     * customer
     */
    private List<CreateNotificationInSubType6DTO> customer;
    /**
     * businessCards
     */
    private List<CreateNotificationInSubType7DTO> businessCards;
    /**
     * dataCalendar
     */
    private List<CreateNotificationInSubType8DTO> dataCalendar;
    /**
     * imports
     */
    private CreateNotificationInSubType9DTO imports;

}
