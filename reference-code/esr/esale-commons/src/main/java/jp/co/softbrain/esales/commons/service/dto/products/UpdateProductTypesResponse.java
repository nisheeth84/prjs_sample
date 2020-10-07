package jp.co.softbrain.esales.commons.service.dto.products;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Update Product Types Out DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductTypesResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6994129125237136419L;

    /**
     * deletedProductTypes
     */
    private List<Long> deletedProductTypes;

    /**
     * createdProductTypes
     */
    private List<Long> createdProductTypes;

    /**
     * updatedProductTypes
     */
    private List<Long> updatedProductTypes;
}
