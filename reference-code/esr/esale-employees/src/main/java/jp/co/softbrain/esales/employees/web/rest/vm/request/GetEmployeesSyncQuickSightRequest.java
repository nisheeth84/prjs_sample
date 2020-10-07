package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request entity for API get-employee-sync-quick-sight
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetEmployeesSyncQuickSightRequest implements Serializable {

    private static final long serialVersionUID = 8825144218175058494L;

    private List<Long> employeeIds;
}
