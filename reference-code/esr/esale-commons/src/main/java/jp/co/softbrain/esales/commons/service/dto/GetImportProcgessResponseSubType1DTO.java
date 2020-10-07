package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

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
public class GetImportProcgessResponseSubType1DTO extends BaseDTO implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8080624454868396784L;

    /**
     * import Progress Id
     */
    private Long importProgressId;
    
    /**
     * import Id
     */
    private Long importId;
    
    /**
     * import Status
     */
    private Integer importStatus;
    
    /**
     * import Row Finish
     */
    private Integer importRowFinish;
    
    /**
     * import Batch Start Time
     */
    private String importBatchStartTime;
    
    /**
     * import Batch Finish Time
     */
    private String importBatchFinishTime;
}
