/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

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
public class ValidateResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2623410646560557301L;

    /**
     * requestData
     */
    private List<Map<String, Object>> errors;
    
    /**
     * status
     */
    private int status;
}
