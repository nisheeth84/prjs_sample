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
public class GetRelationDataSubType5DTO implements Serializable {

    private static final long serialVersionUID = -6107501166181735630L;

    private Long itemId;

    private Boolean isAvailable;

    private Long itemOrder;

    private Boolean isDefault;

    private String itemLabel;

}
