package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * request of GetBusinessCardDepartments API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class GetBusinessCardDepartmentsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6198627797729283934L;

    /**
     * customerId
     */
    private Long customerId;

}
