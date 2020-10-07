/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for API getCustomFieldsInfoByFieldIds
 * 
 * @author Trungnd
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomFieldsInfoByFieldIdsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6345281292465434166L;

    /**
     * fields
     */
    private List<CustomFieldsInfoOutDTO> fields;
}
