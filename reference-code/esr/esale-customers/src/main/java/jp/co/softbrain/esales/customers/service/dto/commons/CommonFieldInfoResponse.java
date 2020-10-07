/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.commons;

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
