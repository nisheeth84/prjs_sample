package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getGroups
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetGroupsSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 25235235235235L;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * groupName
     */
    private String groupName;

    /**
     * groupType
     */
    private Integer groupType;

    /**
     * isAutoGroup
     */
    private Boolean isAutoGroup;

    /**
     * employeeIds
     */
    private List<Long> employeeIds;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
