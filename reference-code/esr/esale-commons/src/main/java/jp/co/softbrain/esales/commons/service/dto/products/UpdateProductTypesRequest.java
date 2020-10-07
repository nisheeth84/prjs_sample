package jp.co.softbrain.esales.commons.service.dto.products;
import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 *
 * @author trungbh
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductTypesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5431129523776572478L;

    /**
     * deletedProductTypes
     */
    private List<Long> deletedProductTypes;

    /**
     * productTypes
     */
    private List<UpdateProductTypesLst> productTypes;

    /**
     * updateFieldIdUse
     */
    private UpdateProductTypeFieldIdUse updateFieldIdUse;
}

