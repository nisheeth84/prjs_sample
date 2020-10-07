package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Invite Employees In DTO
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class InviteEmployeesInDTO implements Serializable{

    private static final long serialVersionUID = -5767036616831183317L;

    /**
     * The Employees Surname
     */
    private String employeeSurname;

    /**
     * The Employees name
     */
    private String employeeName;

    /**
     * The Employees email
     */
    private String email;

    /**
     * The Employees password
     */
    private String password;

    /**
     * The Department List
     */
    private List<Long> departmentIds;

    /**
     * The License List
     */
    private List<Long> packageIds;

    /**
     * isAdmin
     */
    private Boolean isAdmin;

    /**
     * isAccessContractSite
     */
    private Boolean isAccessContractSite;

    /**
     * The Option List
     */
    private List<Long> optionIds;

    private String companyName;
    private String tenantName;

    private Long userId;

    private String language;

}
