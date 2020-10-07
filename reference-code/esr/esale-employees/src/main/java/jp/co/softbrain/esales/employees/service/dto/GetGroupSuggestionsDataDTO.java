package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import jp.co.softbrain.esales.utils.StringUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetGroupSuggestionsDataDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetGroupSuggestionsDataDTO implements Serializable {

    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5924029981295287962L;

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
     * lastUpdatedDate
     */
    private Instant lastUpdatedDate;

    /**
     * isOverWrite
     */
    private Boolean isOverWrite;

    /**
     * lastUpdatedDate
     */
    private String employeeSurname;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * @param groupId
     * @param groupName
     * @param groupType
     * @param isAutoGroup
     * @param lastUpdatedDate
     * @param isOverWrite
     * @param employeeSurname
     * @param employeeName
     */
    public GetGroupSuggestionsDataDTO(Long groupId, String groupName, Integer groupType, Boolean isAutoGroup,
            Instant lastUpdatedDate, Boolean isOverWrite, String employeeSurname, String employeeName) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.groupType = groupType;
        this.isAutoGroup = isAutoGroup;
        this.lastUpdatedDate = lastUpdatedDate;
        this.isOverWrite = isOverWrite;
        this.employeeSurname = employeeSurname;
        this.employeeName = StringUtil.getFullName(employeeSurname, employeeName);
    }

}
