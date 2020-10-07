package jp.co.softbrain.esales.customers.service.dto;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 * CustomerLayoutPersonalResponseDTO
 */
@Data
public class CustomerLayoutPersonalResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3382013645277941849L;

    /**
     * listCustomerLayoutPersonal
     */
    private List<CustomerLayoutPersonalFieldInfo> fields = new ArrayList<>();

}
