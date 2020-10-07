package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType5DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType5DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 162136247247L;

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

}
