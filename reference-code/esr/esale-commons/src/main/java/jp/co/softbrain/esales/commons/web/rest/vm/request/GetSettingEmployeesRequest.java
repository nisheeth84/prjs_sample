package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API get setting employee
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetSettingEmployeesRequest implements Serializable {

    private static final long serialVersionUID = 8534197153236902967L;
    
    private List<Long> employeeIds;
    
    private Integer settingTime;
}
