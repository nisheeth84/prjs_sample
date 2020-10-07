package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for api getFavoriteCustomers
 */
@Data
@EqualsAndHashCode
public class GetFavoriteCustomersOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3210686456427013880L;

    /**
     * listGroupCustomers
     */
    private List<GetFavoriteCustomersListInfoDTO> listGroupCustomers;

    /**
     * listFavoriteCustomerOfEmployee
     */
    private List<GetFavoriteCustomersListCustomerInfoDTO> listFavoriteCustomerOfEmployee = new ArrayList<>();

}
