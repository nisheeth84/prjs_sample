/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonFieldInfoResponse implements Serializable {
    private static final long serialVersionUID = 6345281292465434166L;

    /**
     * requestData
     */
    private List<FieldInfoPersonalsOutDTO> fieldInfoPersonals;

    /**
     * fieldInfoCustoms
     */
    private List<CustomFieldsInfoOutDTO> customFieldsInfo;
}
