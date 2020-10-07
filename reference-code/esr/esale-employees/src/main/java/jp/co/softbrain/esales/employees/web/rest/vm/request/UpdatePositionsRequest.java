package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;
import lombok.Data;

@Data
public class UpdatePositionsRequest implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3572248095560084349L;
    private List<PositionsDTO> positions;
    private List<Long> deletedPositions;
}
