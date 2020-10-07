/**
 *
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Response for API update setting employee
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSettingEmployeeResponse implements Serializable{

    private static final long serialVersionUID = -4341454915459507888L;

    private Long employeeId;
}
