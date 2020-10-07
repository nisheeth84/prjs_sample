package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getInitializeListInfo
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class GetInitializeListInfoResponse implements Serializable {

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
