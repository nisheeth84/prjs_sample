/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response Sub DTO for API createList
 * 
 * @author phamminhphu
 *
 */
@Data
@EqualsAndHashCode
public class CreateListOutSubType1DTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -894233781980149199L;
    
    /**
     * customerListMemberId
     */
    private Long customerListMemberId;
    
    /**
     * customerListSearchConditionId
     */
    private Long customerListSearchConditionId;

}
