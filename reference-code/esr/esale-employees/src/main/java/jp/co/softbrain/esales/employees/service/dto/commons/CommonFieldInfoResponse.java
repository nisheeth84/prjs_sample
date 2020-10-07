package jp.co.softbrain.esales.employees.service.dto.commons;

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
    private static final long serialVersionUID = -254158253535549584L;

    /**
     * requestData
     */
    private List<FieldInfoPersonalsOutDTO> fieldInfoPersonals;
    
    /**
     * fieldInfoCustoms
     */
    private List<CustomFieldsInfoOutDTO> customFieldsInfo;
}
