package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author trungbh
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType10DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -831215547193659511L;
    /**
     * employeeId
     */
    private Long employeeId;
    /**
     * employeeName
     */
    private String employeeName;
    /**
     * photoEmployeeImg
     */
    private String photoEmployeeImg;
    /**
     * attendanceDivision
     */
    private Long attendanceDivision;
}
