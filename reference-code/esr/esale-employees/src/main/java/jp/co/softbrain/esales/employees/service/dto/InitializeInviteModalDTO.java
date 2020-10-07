package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Initialize Invite Modal DTO
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class InitializeInviteModalDTO implements Serializable{
	
    private static final long serialVersionUID = -1108508702105758445L;

    /**
     * The Departments
     */
    private List<DepartmentDTO> departments;

    /**
     * The Licenses
     */
    private List<PackagesDTO> packages;
}
