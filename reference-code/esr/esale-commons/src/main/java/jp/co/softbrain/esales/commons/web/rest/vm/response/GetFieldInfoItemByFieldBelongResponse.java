package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemLabelDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for API getFieldInfoItemByFieldBelong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetFieldInfoItemByFieldBelongResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 587222245334957646L;
    private List<FieldInfoItemLabelDTO> fieldInfoItems;

}
