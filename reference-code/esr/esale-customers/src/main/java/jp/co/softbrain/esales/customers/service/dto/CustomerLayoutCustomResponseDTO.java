package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerLayoutResponseDTO
 */
@Data
@EqualsAndHashCode
public class CustomerLayoutCustomResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6926095923568354937L;

    /**
     * listCustomerLayouts
     */
    private List<CustomerLayoutCustomFieldInfoDTO> fields = new ArrayList<>();

}
