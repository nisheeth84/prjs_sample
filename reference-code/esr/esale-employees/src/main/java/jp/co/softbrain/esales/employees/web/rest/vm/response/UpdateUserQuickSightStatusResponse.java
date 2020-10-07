package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API update-user-quick-sight-status
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserQuickSightStatusResponse implements Serializable {

    private static final long serialVersionUID = 2113822587066524006L;

    private List<Long> employeeIds;
}
