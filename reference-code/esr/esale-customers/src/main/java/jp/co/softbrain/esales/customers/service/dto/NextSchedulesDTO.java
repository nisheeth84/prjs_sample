package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomerOutSchedulesDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class NextSchedulesDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7869100544046037043L;

    /**
     * schedulesId
     */
    private Long schedulesId;

    /**
     * schedulesName
     */
    private String schedulesName;

    /**
     * customerId
     */
    private Long customerId;

}
