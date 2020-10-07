package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getInitializeListInfo
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class GetInitializeListInfoOutDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -4594861260277148461L;

    /**
     * initializeInfo
     */
    private GetInitializeListInfoSubType1DTO initializeInfo;

    /**
     * List fields
     */
    private List<FieldInfoPersonalsOutDTO> fields;
}
