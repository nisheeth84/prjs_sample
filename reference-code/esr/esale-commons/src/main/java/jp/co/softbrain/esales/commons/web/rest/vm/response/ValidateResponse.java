/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ValidateResponse implements Serializable {
    private static final long serialVersionUID = 6910991030057322317L;

    /**
     * requestData
     */
    private List<Map<String, Object>> errors;

    /**
     * status
     */
    private int status;
}
