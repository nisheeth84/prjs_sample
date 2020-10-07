package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Out DTO call for API deleteCustomers
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class DeleteCustomersOutDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 5800652834510163043L;

    /**
     * customerIdsDeleteSuccess
     */
    private List<Long> customerIdsDeleteSuccess = new ArrayList<>();

    /**
     * customerDeleteFails
     */
    private List<DeleteCustomersOutSubTypeDTO> customerDeleteFails = new ArrayList<>();
}
