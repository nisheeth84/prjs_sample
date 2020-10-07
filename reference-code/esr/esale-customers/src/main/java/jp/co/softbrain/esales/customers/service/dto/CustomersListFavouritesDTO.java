package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.CustomersListFavourites;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link CustomersListFavourites}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListFavouritesDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -3095547954995034079L;

    /**
     * customerListFavouriteId
     */
    private Long customerListFavouriteId;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * displayOrder
     */
    private Integer displayOrder;
}
