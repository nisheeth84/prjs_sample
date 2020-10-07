package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class api getChildCustomers
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetChildCustomersOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3740998013122745547L;

    /**
     * childCustomers
     */
    private List<GetChildCustomersSupType1DTO> childCustomers;

}
