/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for API GetEmployeeSuggestionsChoice
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeSuggestionsChoiceDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 97554481359387762L;

    /**
     * suggestionsChoiceId
     */
    private Long suggestionsChoiceId;

    /**
     * index
     */
    private String index;

    /**
     * idResult
     */
    private Long idResult;
}
