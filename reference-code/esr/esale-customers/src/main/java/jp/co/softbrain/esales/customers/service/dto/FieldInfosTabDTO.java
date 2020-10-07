package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.service.dto.commons.GetFieldInfoTabsResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutSubType15DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfosTabDTO extends GetFieldInfoTabsResponseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4689824216780070246L;
}
