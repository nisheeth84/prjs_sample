package jp.co.softbrain.esales.uaa.service.dto.employees;
import java.io.Serializable;

import jp.co.softbrain.esales.uaa.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the EmpDetail entity.
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class EmpDetailDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -4207423971582965755L;

    /**
     * The EmpDetail employeeId
     */
    private Long employeeId;

    /**
     * The EmpDetail employeeCode
     */
    private String employeeCode;
    /**
     * The EmpDetail email
     */
    private String email;

}
