package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType7DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType7DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2162476374571L;
    /**
     * businessCardId
     */
    private Long businessCardId;
    /**
     * businessCardName
     */

    private String businessCardName;
    /**
     * companyName
     */
    private String companyName;
    /**
     * receivers
     */
    private List<ReceiverDTO> receivers;
    /**
     * modeBusinessCard
     */
    private int modeBusinessCard;

}
