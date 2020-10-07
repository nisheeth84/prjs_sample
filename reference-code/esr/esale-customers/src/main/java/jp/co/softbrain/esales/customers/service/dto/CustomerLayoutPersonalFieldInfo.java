package jp.co.softbrain.esales.customers.service.dto;

import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomerLayoutPersonalFieldInfo
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerLayoutPersonalFieldInfo extends FieldInfoPersonalsOutDTO {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8113240006274065590L;

    /**
     * listFieldsItem
     */
    private List<CustomerLayoutFieldItemDTO> listFieldsItem = new ArrayList<>();

}
