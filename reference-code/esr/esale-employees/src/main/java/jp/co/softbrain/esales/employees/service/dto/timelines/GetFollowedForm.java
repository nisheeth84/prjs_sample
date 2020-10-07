package jp.co.softbrain.esales.employees.service.dto.timelines;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
public class GetFollowedForm implements Serializable {

    public GetFollowedForm() {

    }
    public GetFollowedForm(Integer limit, Integer offset, Integer followTargetType,
            Long followTargetId) {
        this.limit = limit;
        this.offset = offset;
        this.followTargetType = followTargetType;
        this.followTargetId = followTargetId;
    }

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2753620464121490462L;

    /**
     * The limit
     */
    private Integer limit;

    /**
     * The offset
     */
    private Integer offset;

    /**
     * The followTargetType
     */
    private Integer followTargetType;

    /**
     * The followTargetId
     */
    private Long followTargetId;

}
