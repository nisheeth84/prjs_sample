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
public class GetSchedulesByIdsSubType8DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8544422220236344534L;
    /**
     * departmentId
     */
    private Long departmentId;
    /**
     * departmentName
     */
    private String departmentName;
    /**
     * photoDepartmentImg
     */
    private String photoDepartmentImg;
}
