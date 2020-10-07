package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Search condition dto
 *
 * @author nghianv
 */
@Data
@EqualsAndHashCode
public class FieldInfoPersonalsInputDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4954407396876528109L;

    /**
     * Constructor
     * 
     * @param employeeId
     * @param fieldBelong
     * @param extensionBelong
     * @param selectedTargetType
     * @param selectedTargetId
     */
    public FieldInfoPersonalsInputDTO(Long employeeId, Integer fieldBelong, Integer extensionBelong,
            Integer selectedTargetType, Long selectedTargetId) {
        super();
        this.employeeId = employeeId;
        this.fieldBelong = fieldBelong;
        this.extensionBelong = extensionBelong;
        this.selectedTargetType = selectedTargetType;
        this.selectedTargetId = selectedTargetId;
    }

    /**
     * Constructor
     */
    public FieldInfoPersonalsInputDTO() {

    }

    /**
     * employee Id
     */
    private Long employeeId;

    /**
     * 使用機能
     */
    private Integer fieldBelong;

    /**
     * extension Belong
     */
    private Integer extensionBelong;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;
}
