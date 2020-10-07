package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for api getCustomerList
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetCustomerListOutDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -2754902524287867707L;

    /**
     * myList
     */
    private List<GetCustomerListSubType1DTO> myList;

    /**
     * sharedList
     */
    private List<GetCustomerListSubType1DTO> sharedList;

    /**
     * favouriteList
     */
    private List<GetCustomerListSubType1DTO> favouriteList;
}
