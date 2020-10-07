/**
 * 
 */
package jp.co.softbrain.esales.uaa.service.dto.commons;

import java.io.Serializable;
import java.util.List;

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

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4177882472151087524L;

    /**
     * requestData
     */
    private List<FieldInfoPersonalsOutDTO> fieldInfoPersionals;
    
    /**
     * fieldInfoCustoms
     */
    private List<CustomFieldsInfoOutDTO> fieldInfoCustoms;
}
