package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO output for API getOperatorsOfTasks
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetOperatorsOfTasksSubType2DTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -663394565101862605L;
    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * photoEmployeeImg
     */
    private String photoEmployeeImg;

    /**
     * departmentsPositions
     */
    private List<GetOperatorsOfTasksSubType3DTO> departmentsPositions = new ArrayList<>();

    /**
     * The employeeNameKana
     */
    private String employeeNameKana;

    /**
     * The flagActivity
     */
    private String flagActivity;

    /**
     * The telephoneNumber
     */
    private String cellphoneNumber;

    /**
     * The cellphoneNumber
     */
    private String telephoneNumber;

    /**
     * The email
     */
    private String email;

    /**
     * The employeeNameKana
     */
    private String employeeSurnameKana;

}
