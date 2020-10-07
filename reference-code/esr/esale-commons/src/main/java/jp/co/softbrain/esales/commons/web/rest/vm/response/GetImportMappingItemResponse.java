package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;
import jp.co.softbrain.esales.commons.service.dto.GetImportMappingItemDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response for get-import-mapping-item API
 * @author dohuyhai
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetImportMappingItemResponse implements Serializable {
    
    /**
     * serialVersionUID 
     */
    private static final long serialVersionUID = -1427895401178968995L;
    
    /**
     * import Mapping Item
     */
    private List<GetImportMappingItemDTO> importMappingItem;
}
