package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetListSuggestionsOutDTO
 * 
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class GetListSuggestionsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4497147308248606930L;

    /**
     * listInfo
     */
    private List<SuggestionOutDTO> listInfo;

}
