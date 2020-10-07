/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for participantDepartment in API InitializeGroupModal
 * 
 * @author buithingocanh
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ParticipantDepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * The departments departmentId
     */
    private Long departmentId;

    /**
     * The departments departmentName
     */
    private String departmentName;

    /**
     * The departments departmentParentName
     */
    private String parentDepartmentName;

}
