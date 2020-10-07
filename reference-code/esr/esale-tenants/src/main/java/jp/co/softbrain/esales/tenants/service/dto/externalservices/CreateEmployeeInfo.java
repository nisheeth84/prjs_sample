package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request entity for API create-employee
 *
 * @author tongminhcuong
 */
@Data
public class CreateEmployeeInfo implements Serializable {

    private static final long serialVersionUID = -6142536423233178746L;

    private String employeeSurname;

    private String employeeName;

    private String email;

    private String telephoneNumber;

    private Boolean isAdmin;

    private Boolean isAccessContractSite;

    private Long languageId;

    private List<Long> packageIds;

    private List<EmployeeDepartmentDTO> employeeDepartments;
}
