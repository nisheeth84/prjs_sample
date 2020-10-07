package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetProductTradingTabOutDTO
 *
 * @author ngant
 */
@Data
@EqualsAndHashCode
public class GetProductTradingTabOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4151450446851320441L;

    /**
     * dataInfo
     */
    private GetProductTradingTabSubType2DTO dataInfo;

}
