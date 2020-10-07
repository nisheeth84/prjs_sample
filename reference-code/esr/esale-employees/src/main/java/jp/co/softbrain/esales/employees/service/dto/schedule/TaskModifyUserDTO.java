package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO presentation as modified user
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class TaskModifyUserDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6686407708311607516L;

    private Long employeeId;

    private String email;

    private String employeeName;

    private String employeeSurname;

    private String employeeFullname;

    private String photoFileName;

    private String photoFilePath;

    private String photoFileUrl;

}
