package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.DataChange}
 * entity.
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DataChangeDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -7963608940896544172L;


    /**
     * The Datachange id
     */
    private Long dataChangeId;

    /**
     * The Datachange target Id
     */
    private Integer dataId;


    /**
     * The Datachange extension_belong
     */
    private Integer extensionBelong;


    /**
     * The Datachange action
     */
    private Integer action;
}
