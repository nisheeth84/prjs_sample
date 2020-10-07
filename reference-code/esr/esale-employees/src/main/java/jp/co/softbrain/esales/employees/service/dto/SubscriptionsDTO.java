package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Subscriptions}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SubscriptionsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -7321551895980113387L;

    /**
     * The Subscriptions subscriptionId
     */
    private Long subscriptionId;

    /**
     * The Subscriptions employeeId
     */
    private String subscriptionName;

    /**
     * The Subscriptions subscriptionId
     */
    private Long remainLicenses;
    private Boolean isOptionType;

}
