package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SendMailUserResponseDTO
 */
@Data
@EqualsAndHashCode
public class SendMailUserResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1073442165037652677L;

    private Long employeeId;

    private String userName;
    
    private Boolean sendMailSuccess = true;
}
