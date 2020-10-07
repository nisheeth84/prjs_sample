/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesInDTO;
import lombok.Data;

/**
 * request for API InviteEmployees
 * 
 * @author phamdongdong
 *
 */
@Data
public class InviteEmployeesRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2236985495595566820L;
    private List<InviteEmployeesInDTO> inviteEmployeesIn;
}
