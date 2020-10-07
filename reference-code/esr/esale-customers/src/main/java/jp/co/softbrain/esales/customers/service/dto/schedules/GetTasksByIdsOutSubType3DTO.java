package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksByIdsOutSubType3DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutSubType3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 23646346346341L;
    /**
     * departmentId
     */
    private Long departmentId;
    /**
     * departmentName
     */
    private String departmentName;
    /**
     * departmentParentName
     */
    private String departmentParentName;
    /**
     * photoDepartmentImg
     */
    private String photoDepartmentImg;

}
