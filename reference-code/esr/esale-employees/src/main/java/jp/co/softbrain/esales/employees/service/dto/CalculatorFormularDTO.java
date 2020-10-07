package jp.co.softbrain.esales.employees.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor()
@NoArgsConstructor
@Data
public class CalculatorFormularDTO {

    /**
     * The employee id
     */
    private Long employeeId;
    
    /**
     * The field name
     */
    private String fieldName;

    /**
     * The config value
     */
    private String configValue;

    /**
     * @param fieldName
     * @param configValue
     */
    public CalculatorFormularDTO(String fieldName, String configValue) {
        super();
        this.fieldName = fieldName;
        this.configValue = configValue;
    }
}
