package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * GetGroupSuggestionsResponseDTO
 */
@Data
public class GetGroupSuggestionsResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6564355368504223321L;

    /**
     * groupInfo
     */
    private List<GetGroupSuggestionsDataDTO> groupInfo;

}
