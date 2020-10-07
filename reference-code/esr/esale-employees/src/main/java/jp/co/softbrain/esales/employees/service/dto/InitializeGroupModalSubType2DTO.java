/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for participantEmployees when get from DB in API InitializeGroupModal
 * 
 * @author buithingocanh
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class InitializeGroupModalSubType2DTO implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * The Employees employeeId
     */
    private Long employeeId;
    /**
     * The Employees employeeSurname
     */
    private String employeeSurname;
    /**
     * The Employees employeeName
     */
    private String employeeName;
    /**
     * The Departments departmentName
     */
    private String departmentName;

    /**
     * The Employees photoFileName
     */
    private String photoFileName;

    /**
     * The Employees photoFilePath
     */
    private String photoFilePath;
    
    /**
     * positionId
     */
    private Long positionId;
    
    /**
     * positionName
     */
    private String positionName;

}
