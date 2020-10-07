package jp.co.softbrain.esales.customers.service.dto.commons;

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
public class GetRelationDataSubType3DTO implements Serializable {

    private static final long serialVersionUID = -530293401961884702L;

    private Long recordId;

    private List<GetRelationDataSubType4DTO> dataInfos;

}
