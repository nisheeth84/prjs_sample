package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * DTO need for API getSelectedOrganizationInfo
 * @author chungochai
 *
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GroupSelectedOrganizationDTO  implements Serializable{
     
    private static final long serialVersionUID = 6516150108072076311L;
    
    private Long groupId;
    
    private String groupName;
    
    private Long employeeId;
}
