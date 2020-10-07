package jp.co.softbrain.esales.employees.service.dto.customers;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * ModifyUserDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ModifyUserDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2672200145518710340L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeName
     */
    private String employeePhoto;

    /**
     * fileUrl
     */
    private String fileUrl;

}
