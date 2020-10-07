package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * GetGroupSuggestionsRequest
 */
@Data
public class GetGroupSuggestionsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4814563433317565626L;

    /**
     * searchValue
     */
    private String searchValue;

}
