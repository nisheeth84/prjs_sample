package jp.co.softbrain.esales.customers.service.dto;

import jp.co.softbrain.esales.customers.domain.MastersStands;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * DTO class for the entity {@link MastersStands}
 *
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersStandsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 3961577140246878350L;

    /**
     * masterStandId
     */
    private Long masterStandId;

    /**
     * masterStandName
     */
    private String masterStandName;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    private Integer displayOrder;
}
