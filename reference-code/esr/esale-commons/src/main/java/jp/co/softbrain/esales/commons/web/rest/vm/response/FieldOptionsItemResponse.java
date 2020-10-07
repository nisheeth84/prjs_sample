package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.FieldOptionItemDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for API [getFieldOptionsItem]
 *
 * @author Trungnd
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldOptionsItemResponse implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3747613750752845319L;

    /**
     * fieldOptionsItem
     */
    private List<FieldOptionItemDTO> fieldOptionsItem;
}
