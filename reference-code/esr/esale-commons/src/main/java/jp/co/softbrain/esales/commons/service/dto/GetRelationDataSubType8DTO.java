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
public class GetRelationDataSubType8DTO implements Serializable{

    private static final long serialVersionUID = -6996944621926264511L;

    private Long departmentId;

    private String departmentName;

    private GetRelationDataSubType9DTO parentDepartment;

    private List<Long> employeeIds;

}
