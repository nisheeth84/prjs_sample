/**
 * 
 */
package jp.co.softbrain.esales.uaa.service.dto.commons;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
public class ValidateResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1982183693894881597L;

    /**
     * requestData
     */
    private List<Map<String, Object>> errors;

    /**
     * status
     */
    private int status;
}
