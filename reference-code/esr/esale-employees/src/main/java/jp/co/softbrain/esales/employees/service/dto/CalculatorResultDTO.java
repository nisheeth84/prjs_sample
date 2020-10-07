package jp.co.softbrain.esales.employees.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor()
@NoArgsConstructor
@Data
public class CalculatorResultDTO {

    /**
     * The employee id
     */
    private Long employeeId;

    /**
     * The result data
     */
    private Double result;
}
