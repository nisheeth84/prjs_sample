package jp.co.softbrain.esales.customers.service.dto.sales;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * A DTO for the {@link jp.co.softbrain.esales.sales.domain.ProductTradings}
 * entity.
 *
 * @author LocVX
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductTradingsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3154651339786260530L;

    /**
     * productTradingId
     */
    private Long productTradingId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * productId
     */
    private Long productId;

    /**
     * productName
     */
    private String productName;

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
     * productTradingProgressId
     */
    private Long productTradingProgressId;

    /**
     * progressName
     */
    private String progressName;

    /**
     * progressOrder
     */
    private Long progressOrder;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * employeeId
     */
    @JsonIgnore
    private Long employeeId;

    /**
     * endPlanDate
     */
    private Instant endPlanDate = Instant.now();

    /**
     * orderPlanDate
     */
    private Instant orderPlanDate = Instant.now();

    /**
     * memo
     */
    private String memo;

    /**
     * productTradingData
     */
    private List<ProductTradingDataTypeDTO> productTradingData;

    /**
     * productTradingHistories
     */
    private List<ProductsTradingsHistoriesDTO> productTradingHistories;

    /**
     * productTradingHistory
     */
    private ProductsTradingsHistoriesDTO productTradingHistory;

    /**
     * employee
     */
    private EmployeeInfoSubType1DTO employee;

    /**
     * createdUser
     */
    private EmployeeInfoSubType1DTO createdUser;

    /**
     * createdUser
     */
    @JsonIgnore
    private Long createdUserLong;

    /**
     * updatedUser
     */
    private EmployeeInfoSubType1DTO updatedUser;

    /**
     * createdUser
     */
    @JsonIgnore
    private Long updatedUserLong;

    /**
     * The createdDate
     */
    protected Instant createdDate;

    /**
     * The updatedDate
     */
    protected Instant updatedDate;

}
