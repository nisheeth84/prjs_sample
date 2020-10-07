package jp.co.softbrain.esales.employees.service.dto.timelines;

/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author hieudn
 */
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetTimelineGroupsSubType4DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -2860874201097387426L;
    /**
     * The departmentName
     */
    private String departmentName;
    /**
     * The positionName
     */
    private String positionName;
    /**
     * The employeeSurNameKana
     */
    private String employeeSurNameKana;
    /**
     * The employeeNameKana
     */
    private String employeeNameKana;
    /**
     * The cellPhoneNumber
     */
    private String cellPhoneNumber;
    /**
     * The telePhoneNumber
     */
    private String telePhoneNumber;
    /**
     * The email
     */
    private String email;
    
}
