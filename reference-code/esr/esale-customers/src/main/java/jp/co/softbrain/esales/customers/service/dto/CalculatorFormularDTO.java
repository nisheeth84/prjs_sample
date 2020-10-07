package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CalculatorFormularDTO
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
public class CalculatorFormularDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3540282252285449667L;

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
