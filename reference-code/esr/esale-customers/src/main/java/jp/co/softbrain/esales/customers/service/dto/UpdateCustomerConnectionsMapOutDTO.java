package jp.co.softbrain.esales.customers.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * Update Customer Connections Map Out DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class UpdateCustomerConnectionsMapOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8562817827608029654L;

    /**
     * masterMotivation
     */
    private MasterMotivationOutDTO masterMotivation;

    /**
     * masterStand
     */
    private MasterStandOutDTO masterStand;

}
