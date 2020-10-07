package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateProductTradingsListResponse of api createProductTradingsList
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductTradingsListResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4954321313876528109L;

    /**
     * productTradingListDetailId
     */
    private Long productTradingListDetailId;
}
