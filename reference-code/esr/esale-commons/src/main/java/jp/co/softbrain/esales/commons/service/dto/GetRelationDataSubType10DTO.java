/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for response of API GetRelationDatas
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class GetRelationDataSubType10DTO implements Serializable {

    private static final long serialVersionUID = 7809909420320331724L;

    private Long groupId;

    private String groupName;

    private List<Long> employeeIds;
}
