package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType6DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType7DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType8DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationInSubType9DTO;
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
