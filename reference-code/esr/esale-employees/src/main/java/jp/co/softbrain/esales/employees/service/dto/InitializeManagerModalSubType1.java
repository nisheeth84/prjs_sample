package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class InitializeManagerModalSubType1 implements Serializable {

    private static final long serialVersionUID = 8857743915980183570L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeePhoto
     */
    private EmployeeIconDTO employeePhoto;

    /**
     * department
     */
    private List<InitializeManagerModalSubType2> departments;
}
