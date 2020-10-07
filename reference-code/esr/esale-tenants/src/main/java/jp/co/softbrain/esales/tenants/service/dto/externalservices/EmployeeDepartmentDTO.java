package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * EmployeeDepartmentDTO
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDepartmentDTO implements Serializable {

    private static final long serialVersionUID = -3944482345419554259L;

    private Long departmentId;

    private Long positionId;
}
