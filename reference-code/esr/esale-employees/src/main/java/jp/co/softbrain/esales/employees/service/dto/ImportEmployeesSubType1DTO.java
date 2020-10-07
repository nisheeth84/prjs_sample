package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees: information mapping column CSV and column DB.
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4483826030686187771L;

    /**
     * The value of the name of the field in the DB
     */
    private String fieldName;

    /**
     * Field id
     */
    private Long fieldId;

    /**
     * Header value CSV.
     */
    private String csvHeader;

    /**
     * Default category flag
     */
    private Boolean isDefault;

    /**
     * Mapping type select box, radio, checkbox.
     */
    private List<ImportEmployeesSubType2DTO> mappingOptionValue;
}
