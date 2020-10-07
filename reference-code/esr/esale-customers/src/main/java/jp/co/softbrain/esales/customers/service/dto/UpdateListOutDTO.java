/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class output for API updateList
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class UpdateListOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1646528293576663015L;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListParticipantIds
     */
    private List<CustomersListParticipantsDTO> customerListParticipantIds = new ArrayList<>();
    
    /**
     * customerListSearchConditionIds
     */
    private List<CustomersListSearchConditionsDTO> customerListSearchConditionIds = new ArrayList<>();

}
