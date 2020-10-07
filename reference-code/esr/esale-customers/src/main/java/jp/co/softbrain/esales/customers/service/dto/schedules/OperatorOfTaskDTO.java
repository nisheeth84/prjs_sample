package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * OperatorOfTaskDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class OperatorOfTaskDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5511744907033140419L;

    private Integer operatorDivision;

    private Long employeeId;

    private String employeeName;

    private String employeeImage;

    private Long departmentId;

    private String departmentName;

    private Long groupId;

    private String groupName;

    /* employee information start */
    private String cellphoneNumber;

    private String email;

    private String employeeSurname;

    private String employeeSurnameKana;

    private String employeeNameKana;

    private String telephoneNumber;

    private String departmentOfEmployee;

    private String positionName;
    /* employee information end */
}
