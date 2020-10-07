package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Invite Employees Out DTO
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class InviteEmployeesOutDTO implements Serializable{
    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 410827824305747523L;


    /**
     * sendedMailResults
     */
    private List<InviteEmployeesSubType1DTO> employees;

}
