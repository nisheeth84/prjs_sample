package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * countProductTradingbyCustomersDTO DTO for countProductTradingbyCustomers
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CountProductTradingbyCustomersDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1233651312786260530L;

    /**
     * The quantityProductTradingByCustomers
     */
    private List<CountProductTradingbyCustomersSubType1DTO> quantityProductTradingByCustomers;

}
