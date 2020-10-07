package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for api getFavoriteCustomers
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetFavoriteCustomersListInfoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3210686486427013880L;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
