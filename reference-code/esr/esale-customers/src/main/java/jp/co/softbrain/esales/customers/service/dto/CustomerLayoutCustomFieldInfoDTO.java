package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO for API getCustomerLayout
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerLayoutCustomFieldInfoDTO extends CustomFieldsInfoOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1313243234405814850L;

    /**
     * listFieldItem
     */
    private List<CustomerLayoutFieldItemDTO> listFieldsItem = new ArrayList<>();

}
