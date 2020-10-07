package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.employees.EmployeeInfoDTO;

/**
 * Response API get employees by Ids
 * 
 * @author lehuuhoa
 */
@Data
@EqualsAndHashCode
public class GetEmployeesByIdsResponse implements Serializable {

    private static final long serialVersionUID = 1098711502578774263L;
    /**
     * employees
     */
    private List<EmployeeInfoDTO> employees;
}
