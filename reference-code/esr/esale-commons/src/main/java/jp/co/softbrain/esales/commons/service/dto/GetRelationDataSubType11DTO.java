package jp.co.softbrain.esales.commons.service.dto;

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
public class GetRelationDataSubType11DTO implements Serializable {

    private static final long serialVersionUID = -7811972962193238560L;

    private String employeeName;

    private Long employeeId;
}
