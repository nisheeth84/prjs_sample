package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Invite Employees Sub Type1 DTO
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class InviteEmployeesSubType1DTO implements Serializable{
    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 410827824305747523L;

    /**
     * SendedMailResultsOut memberName
     */
    private String memberName;

    /**
     * SendedMailResultsOut emailAddress
     */
    private String emailAddress;

    /**
     * InviteEmployeesSubType1DTO isSentEmailError
     */
    private boolean isSentEmailError;

}
