/**
 * 
 */
package jp.co.softbrain.esales.uaa.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response for API get emp detail
 * 
 * @author phamminhphu
 */
@Data
@AllArgsConstructor
public class GetEmpDetailRequest implements Serializable {
    private static final long serialVersionUID = 4953026814941341367L;
    private String employeeCode;
}
