package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetImportInitInfoResponseDTO
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class GetImportInitInfoResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8248714201064610165L;

    /**
     * list importMappings
     */
    private List<GetImportInitInfoSubType1DTO> importMappings;

    /**
     * list matchingKeys
     */
    private List<GetImportInitInfoSubType3DTO> matchingKeys;

}
