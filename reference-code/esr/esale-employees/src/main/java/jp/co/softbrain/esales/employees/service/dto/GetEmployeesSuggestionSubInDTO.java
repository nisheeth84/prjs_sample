package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for information group
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionSubInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 289037081700316813L;

    /**
     * idChoice
     */
    private Long idChoice;

    /**
     * searchType
     */
    private Integer searchType;
}
