package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API get-employee-sync-quick-sight
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeesSyncQuickSightResponse implements Serializable {

    private static final long serialVersionUID = 8723192279243758893L;

    private List<EmployeeSyncQuickSightDTO> employees;
}
