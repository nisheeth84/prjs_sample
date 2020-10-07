package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities - object productTrading.
 * 
 * @author TinhBV
 */

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType5DTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -4544562482580631183L;

    private Long                        productTradingId;
    private String                      customerName;
    private Long                        productId;
    private String                      productName;
    private String                      productImagePath;
    private String                      productImageName;
    private Long                        quantity;
    private Double                      price;
    private Double                      amount;
    private Long                        productTradingProgressId;
    private String                      progressName;
    private Instant                     endPlanDate;
    private Instant                     orderPlanDate;
    private GetActivitiesSubType2DTO    employee;
    private String                      memo;
}