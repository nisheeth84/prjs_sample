package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO that presentation for member of group with basic data to show in display
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentsGroupsMembersDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7585939085489684446L;

    private Long employeeId;

    private String email;

    private Integer employeeStatus;

    private String employeeName;

    private String employeeSurname;

    private String employeeFullname;

    private String photoFileName;

    private String photoFilePath;

    private String photoFileUrl;

    private Long orgId;

}
