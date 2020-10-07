package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.FieldRelationItemDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for API getFieldRelationItem
 * 
 * @author TrungND
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetFieldRelationItemResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5135847413886979156L;
    /**
     * fieldRelationItem
     */
    private List<FieldRelationItemDTO> fieldRelationItem;

}
