package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * AddCustomersToListOutSubType2DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class AddCustomersToListOutSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6108636086216974058L;
    /**
     * customerListMemberId
     */
    private Long customerListMemberId;

}
