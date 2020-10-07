package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request entity for API update-user-quick-sight-status
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserQuickSightStatusRequest implements Serializable {

    private static final long serialVersionUID = 9127912889910678543L;

    private List<Long> employeeIds;

    private Boolean isAccountQuicksight;
}
