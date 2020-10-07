package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response entity for API get-all-product-id
 *
 * @author phamhoainam
 */
@Data
public class GetAllProductIdResponse implements Serializable {
    private static final long serialVersionUID = 3061621756233729744L;

    private List<Long> productId;
}
