package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link MastersMotivations}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersMotivationsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 3638481049296783011L;

    /**
     * masterMotivationId
     */
    private Long masterMotivationId;

    /**
     * masterMotivationName
     */
    private String masterMotivationName;

    /**
     * iconType
     */
    private Integer iconType;

    /**
     * iconPath
     */
    private String iconPath;

    /**
     * iconName
     */
    private String iconName;

    /**
     * backgroundColor
     */
    private Integer backgroundColor;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    private Integer displayOrder;

}
