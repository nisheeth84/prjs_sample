package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO for API getPositions
 *
 * @author QuangLV
 */
@Data
@EqualsAndHashCode()
public class GetPositionsOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -8850228837299637620L;

    /**
     * positions : list position
     */
    private List<PositionsDTO> positions;

}
