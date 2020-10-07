package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.CustomersListMembers;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link CustomersListMembers}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListMembersDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 4038710225736875637L;

    /**
     * customerListMemberId
     */
    private Long customerListMemberId;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerId
     */
    private Long customerId;

}
