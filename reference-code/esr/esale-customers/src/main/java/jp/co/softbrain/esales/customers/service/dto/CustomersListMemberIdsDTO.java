package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomersListMemberIdsDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CustomersListMemberIdsDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6716644433432556699L;

    /**
     * customerListMemberIds
     */
    private List<CustomerListMemberIdDTO> customerListMemberIds;

}
