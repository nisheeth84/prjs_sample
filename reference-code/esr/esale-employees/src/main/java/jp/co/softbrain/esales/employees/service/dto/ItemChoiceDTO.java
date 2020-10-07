/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for list item choice suggest
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ItemChoiceDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3876512901635662539L;

    /**
     * idChoice
     */
    private Long idChoice;

    /**
     * searchType
     */
    private Integer searchType;

}
