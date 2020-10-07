package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetBusinessCardContactsRequest
 * 
 * @author ngant
 */
@Data
@EqualsAndHashCode
public class GetBusinessCardContactsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3688129714145048755L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * limit
     */
    private Long limit;

    /**
     * offset
     */
    private Long offset;

}
