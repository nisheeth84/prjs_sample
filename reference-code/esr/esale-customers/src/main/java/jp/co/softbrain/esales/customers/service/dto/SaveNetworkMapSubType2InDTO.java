package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SaveNetworkMapSubType2InDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SaveNetworkMapSubType2InDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 912415979659485471L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * parentName
     */
    private String parentName;

    /**
     * networkStands
     */
    private List<SaveNetworkMapSubType3InDTO> networkStands;

}
