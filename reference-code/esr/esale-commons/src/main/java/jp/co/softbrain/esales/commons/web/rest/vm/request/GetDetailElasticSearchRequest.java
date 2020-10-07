/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetDetailElasticSearchRequest implements Serializable {

    private static final long serialVersionUID = 1528888758081720565L;

    private String index;
    private Integer offset;
    private Integer limit;
    private List<SearchConditionDTO> searchConditions;
    private List<SearchConditionDTO> filterConditions;
    private List<OrderValue> orderBy;
    private String languageCode;

    /**
     * column id (employee_id, product_id, ....)
     */
    private String columnId;

}
