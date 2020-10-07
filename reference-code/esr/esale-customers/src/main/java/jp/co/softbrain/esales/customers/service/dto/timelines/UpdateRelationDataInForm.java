package jp.co.softbrain.esales.customers.service.dto.timelines;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * UpdateRelationDataInForm for API updateRelationData
 *
 * @author HieuDN
 *
 */
@Data
@EqualsAndHashCode
public class UpdateRelationDataInForm implements Serializable{

    /**
     * 
     */
    private static final long serialVersionUID = -4209702834471834146L;

    /**
     * The list of integrated object id
     */
    private List<Long> sourceIds;

    /**
     * The list of after integrated object id
     */
    private Long targetId;

    /**
     * The type of function that need to update
     */
    private Integer type;

}
