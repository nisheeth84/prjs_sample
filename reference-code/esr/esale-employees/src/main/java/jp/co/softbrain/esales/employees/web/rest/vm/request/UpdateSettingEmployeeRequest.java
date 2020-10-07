/**
 *
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Request for API Update setting employee
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSettingEmployeeRequest implements Serializable{

    private static final long serialVersionUID = 738634048174555557L;

    private Long languageId;
    private String languageCode;

    private Long timezoneId;
    private String timezoneName;

    private Integer formatDateId;
    private String formatDate;
}
