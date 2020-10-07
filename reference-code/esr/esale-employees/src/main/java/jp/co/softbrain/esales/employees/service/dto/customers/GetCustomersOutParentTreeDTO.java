package jp.co.softbrain.esales.employees.service.dto.customers;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomersOutParentDTO of api getCustomers
 */
@Data
@EqualsAndHashCode
public class GetCustomersOutParentTreeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -730449224997850209L;

    /**
     * customerId
     */
    private List<Long> pathTreeId;

    /**
     * customerName
     */
    private List<String> pathTreeName;
}
