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
public class GetSchedulesByIdsSubType7DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -993138386573811958L;
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
}
