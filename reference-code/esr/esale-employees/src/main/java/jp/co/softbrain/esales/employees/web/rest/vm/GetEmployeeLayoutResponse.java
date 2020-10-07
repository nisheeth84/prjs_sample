package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeLayoutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response for API GetEmployeeLayout
 * 
 * @author phamdongdong
 *
 */
@Data
@AllArgsConstructor
public class GetEmployeeLayoutResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2236985865295566820L;
    private List<EmployeeLayoutDTO> employeeLayout;

}
