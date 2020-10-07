package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response for API GetBusyEmployees
 * 
 * @author nguyenhaiduong
 */
@Data
@EqualsAndHashCode
public class GetBusyEmployeesResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2432114639858837252L;

    private List<GetBusyEmployeesSubType1DTO> operators;
}
