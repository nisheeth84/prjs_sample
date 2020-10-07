package jp.co.softbrain.esales.employees.service.dto.timelines;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * GetFollowedsOutDTO
 */
@Data
@EqualsAndHashCode
public class GetFollowedsOutDTO implements Serializable {
    /**
     *serialVersionUID
     */
    private static final long serialVersionUID = 1591842512049L;
    /**
     * The followeds
     */
    private List<GetFollowedsSubType1DTO> followeds;
    /**
     * The total
     */
    private long total;
}
