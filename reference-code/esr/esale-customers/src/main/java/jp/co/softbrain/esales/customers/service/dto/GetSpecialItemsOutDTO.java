package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetSpecialItemsOutDTO
 *
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class GetSpecialItemsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -183708305294581223L;

    /**
     * fieldInfoItems
     */
    private List<SpecialItemDTO> fieldInfoItems;

}
