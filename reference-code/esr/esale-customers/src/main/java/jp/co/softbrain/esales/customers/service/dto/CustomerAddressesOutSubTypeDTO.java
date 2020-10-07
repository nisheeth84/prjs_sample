package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class DTO out sub type for API getCustomerAddresses
 */
@Data
@EqualsAndHashCode(exclude = { "customerIds", "customerSchedulesNumber" })
public class CustomerAddressesOutSubTypeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -895956304390049879L;

    /**
     * customerIds
     */
    private List<Long> customerIds = new ArrayList<>();

    /**
     * latitude
     */
    private BigDecimal latitude;

    /**
     * longitude
     */
    private BigDecimal longitude;

    /**
     * customerSchedulesNumber
     */
    private Integer customerSchedulesNumber;

}
