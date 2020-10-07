/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class output for API createList
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
public class CreateListOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5164882687827191634L;
    
    /**
     * customer List Id
     */
    private Long customerListId;

}
