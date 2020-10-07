package jp.co.softbrain.esales.commons.service.dto.products;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Update ProductType Field Id Use
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class UpdateProductTypeFieldIdUse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4653699065560803391L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * productTypeIds
     */
    private List<Long> productTypeIds;

}
