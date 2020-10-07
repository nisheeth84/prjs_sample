/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for updateImportProgress
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateImportProgressRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 497838916600918257L;

    /**
     * import Progress Id
     */
    private Long importProgressId;
    
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
