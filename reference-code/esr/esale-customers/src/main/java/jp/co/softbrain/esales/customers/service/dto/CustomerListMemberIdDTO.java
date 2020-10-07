package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomerListMemberIdDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CustomerListMemberIdDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3415098393469871948L;

    /**
     * customerListMemberId
     */
    private Long customerListMemberId;
}
