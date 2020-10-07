package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for GetBusyEmployees API
 *
 * @author nguyenhaiduong
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetBusyEmployeesSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7293686171326481536L;

    private Long operatorId;
    private Integer operatorDivision;

}
