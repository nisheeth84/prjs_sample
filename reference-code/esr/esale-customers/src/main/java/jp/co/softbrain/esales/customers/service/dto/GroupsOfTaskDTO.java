package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GroupsOfTaskDTO
 */
@Data
@EqualsAndHashCode
public class GroupsOfTaskDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6834761853263772455L;

    private Long groupId;

    private String groupName;

}
