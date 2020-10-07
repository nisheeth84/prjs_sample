package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response of UpdateCustomerRelation API
 *
 * @author thanhDv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCustomerRelationResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1687154882536762222L;
    /**
     * businessCardCompanyId
     */
    private List<Long> businessCardCompanyId = new ArrayList<>();
}
