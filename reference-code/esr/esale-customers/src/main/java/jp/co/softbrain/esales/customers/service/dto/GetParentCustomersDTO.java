package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for getParentCustomer
 * 
 * @author phamminhphu
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class GetParentCustomersDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -232078164368491103L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * pathTreeName
     */
    private String pathTreeName;

    /**
     * pathTreeId
     */
    private List<Long> pathTreeId;
}
