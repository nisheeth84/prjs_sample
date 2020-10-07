package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for api getFavoriteCustomers
 * 
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetFavoriteCustomersSubType4DTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -8019600548222565281L;

    /**
     * customerListFavouriteId
     */
    private Long customerListFavouriteId;
    
    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerId
     */
    private String customerName;

}
