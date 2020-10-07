package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class InitializeManagerModalSubType2 implements Serializable {

    private static final long serialVersionUID = -8865752095862826658L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;
    /**
     * managerId
     */
    private Long managerId;

    /**
     * managerName
     */
    private String managerName;

    /**
     * employeePhoto
     */
    private EmployeeIconDTO managerPhoto;

    /**
     * departmentUpdates
     */
    private List<InitializeManagerModalSubType4> departmentUpdates;
}
