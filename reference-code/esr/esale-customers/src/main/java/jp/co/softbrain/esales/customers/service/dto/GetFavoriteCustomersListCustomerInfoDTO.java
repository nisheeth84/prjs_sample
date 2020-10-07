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
public class GetFavoriteCustomersListCustomerInfoDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 8724516704227590070L;

    /**
     * customerListFavouriteId
     */
    private Long customerListFavouriteId;

    /**
     * customerListFavouriteName
     */
    private String customerListFavouriteName;

    /**
     * customerListFavouriteName
     */
    private List<CustomerNameDTO> listCustomer = new ArrayList<>();

}
