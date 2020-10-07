package jp.co.softbrain.esales.commons.service.dto.products;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.Instant;

/**
 * Update Product Types Lst
 *
 * @author DatDV
 *
 */
@Data
@EqualsAndHashCode
public class UpdateProductTypesLst implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2805740300907661534L;

    /**
     * productTypeId
     */
    private Long productTypeId;

    /**
     * productTypeName
     */
    private String productTypeName;

    /**
     * fieldUse
     */
    private String fieldUse;

    /**
     * BooleanisAvailable
     */
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    private Integer displayOrder;

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
