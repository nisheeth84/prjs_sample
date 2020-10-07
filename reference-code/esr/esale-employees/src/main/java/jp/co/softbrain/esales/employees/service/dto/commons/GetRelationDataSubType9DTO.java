package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for response of API GetRelationDatas
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class GetRelationDataSubType9DTO implements Serializable {

    private static final long serialVersionUID = 1529554230668872433L;

    private String departmentName;

    private Long departmentId;

}
