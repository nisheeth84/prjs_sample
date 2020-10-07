package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.CustomersListParticipants;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link CustomersListParticipants}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListParticipantsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 7954636706151772774L;

    /**
     * customerListParticipantId
     */
    private Long customerListParticipantId;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * participantType
     */
    private Integer participantType;

}
