package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetProductTradingTabSubType5DTO
 *
 * @author ngant
 */
@Data
@EqualsAndHashCode
public class GetProductTradingTabSubType5DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6452376875088893856L;

    /**
     * productTradingId
     */
    private Long productTradingId;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * filePath
     */
    private String filePath;

    /**
     * productId
     */
    private Long productId;

    /**
     * productName
     */
    private String productName;

    /**
     * productTradingProgressId
     */
    private Long productTradingProgressId;

    /**
     * progressName
     */
    private String progressName;

    /**
     * endPlanDate
     */
    private String endPlanDate;

    /**
     * quantity
     */
    private Long quantity;

    /**
     * price
     */
    private Long price;

    /**
     * amount
     */
    private Long amount;

    /**
     * productTradingData
     */
    private List<ProductTradingDataTypeDTO> productTradingData;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
