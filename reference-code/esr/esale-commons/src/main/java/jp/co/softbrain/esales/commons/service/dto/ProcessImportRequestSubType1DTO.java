package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author dohuyhai
 * A DTO for the ProcessImportRequest
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ProcessImportRequestSubType1DTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7384753488837527960L;
    
    /**
     * employee Ids
     */
    private List<Long> employeeIds;
    
    /**
     * group Ids
     */
    private List<Long> groupIds;
    
    /**
     * department Ids
     */
    private List<Long> departmentIds;
}
