package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Input class contains data for createUserLogin
 */
@Data
@EqualsAndHashCode
public class CreateUserInputDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6605967263379092807L;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * Flag define create pass
     */
    private Boolean isCreatePassword = true;

    /**
     * note send mails
     */
    private String comment;

    /**
     * Flag define access to contract site
     */
    private Boolean isAccessContractSite = false;

    /**
     * Name of employee
     */
    private String employeeName;

    /**
     * Employee surname
     */
    private String employeeSurname;

    /**
     * email employee - userId
     */
    private String email;

    /**
     * New password
     */
    private String password;

    private String companyName;

    private String tenantName;

    private String userNameImplement;

}
