package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeLayoutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response for API GetEmployeeLayoutPersonal
 * @author phamdongdong
 *
 */
@Data
@AllArgsConstructor
public class GetEmployeeLayoutPersonalResponse implements Serializable {
    private static final long serialVersionUID = 1555768758091720465L;

    private List<EmployeeLayoutDTO> employeesLayout;
}
