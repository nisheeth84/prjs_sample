package jp.co.softbrain.esales.employees.service.dto.sales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.sales.domain.ProductsTradingsHistories} entity.
 *
 * @author: DatDV
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductsTradingsHistoriesDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1169017410616835007L;

    /**
     * productTradingHistoryId
     */
    private Long productTradingHistoryId;

    /**
     * amount
     */
    private Long amount;

    /**
     * contentChange
     */
    private String contentChange;

    /**
     * endPlanDate
     */
    private Instant endPlanDate;

    /**
     * memo
     */
    private String memo;

    /**
     * orderPlanDate
     */
    private Instant orderPlanDate;

    /**
     * productTradingId
     */
    private Long productTradingId;

    /**
     * productId
     */
    private Long productId;

    /**
     * price
     */
    private Long price;

    /**
     * productTradingProgressId
     */
    private Long productTradingProgressId;

    /**
     * productTradingData
     */
    private String productTradingData;

    /**
     * quantity
     */
    private Long quantity;

    /**
     * contactDate
     */
    private Instant contactDate;

    /**
     * activityId
     */
    private Long activityId;

    /**
     * The createdDate
     */
    private Instant createdDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The updatedUser
     */
    private Long updatedUser;
}
