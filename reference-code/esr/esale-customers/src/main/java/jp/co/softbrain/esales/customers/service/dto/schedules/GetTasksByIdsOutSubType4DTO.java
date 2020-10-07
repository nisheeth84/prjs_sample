package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksByIdsOutSubType4DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutSubType4DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 526374856754541L;
    /**
     * groupId
     */
    private Long groupId;
    /**
     * groupName
     */
    private String groupName;
    /**
     * photoGroupImg
     */
    private String photoGroupImg;

}
