package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.MastersStands;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link MastersStands}
 *
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class MastersStandsType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5376546710705181428L;

    /**
     * masterStandId
     */
    private Long masterStandId;

    /**
     * masterStandName
     */
    private String masterStandName;

}
