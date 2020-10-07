package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node data.employeeSubordinates of response from API getEmployee
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class EmployeeSubordinatesDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4509898292956322505L;

    private FileInfosDTO employeeIcon;

    private Long employeeId;

    private String employeeName;
}
