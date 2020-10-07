package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API create-department
 *
 * @author tongminhcuong
 */
@Data
public class CreateDepartmentRequest implements Serializable {

    private static final long serialVersionUID = -9152851576504366460L;

    private String departmentName;

    private Long managerId;

    private Long parentId;
}
