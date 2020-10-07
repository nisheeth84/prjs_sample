package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.CreateProductTradingsListSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateProductTradingsListSubType2DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateProductTradingsListRequest of api createProductTradingsList
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductTradingsListRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4954321313876528109L;

    /**
     * productTradingList
     */
    private CreateProductTradingsListSubType1DTO productTradingList;

    /**
     * searchConditions
     */
    private List<CreateProductTradingsListSubType2DTO> searchConditions;

    /**
     * listOfproductTradingId
     */
    private List<Long> listOfproductTradingId;
}
