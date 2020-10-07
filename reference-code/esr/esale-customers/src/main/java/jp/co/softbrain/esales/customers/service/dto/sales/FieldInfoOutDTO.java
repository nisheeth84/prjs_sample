package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.sales.domain.ProductTradings}
 * entity.
 *
 * @author LocVX
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class FieldInfoOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3644651312786260530L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * forwardColor
     */
    private String forwardColor;

    /**
     * forwardText
     */
    private String forwardText;

    /**
     * backwardText
     */
    private String backwardText;

    /**
     * backwardColor
     */
    private String backwardColor;

    /**
     * fieldLabel
     * */
    private String fieldLabel;
    
    /**
     * isDefault
     * */
    private Boolean isDefault;
}
