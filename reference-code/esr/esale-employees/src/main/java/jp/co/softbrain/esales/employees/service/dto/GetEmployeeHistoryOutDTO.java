package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class out put for API getEmployeeHistory
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class GetEmployeeHistoryOutDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 6915157999057304041L;

    /**
     * employeeHistory
     */
    private List<GetEmployeeHistoryOutSubType1DTO> employeeHistory = new ArrayList<>();

}
