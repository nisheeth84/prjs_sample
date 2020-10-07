package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.employees.GetSettingEmployeeDataDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response for API get setting employee
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
public class GetSettingEmployeesResponse implements Serializable {
    private static final long serialVersionUID = 6553558418724188235L;

    private List<GetSettingEmployeeDataDTO> employeeSettings;
}
