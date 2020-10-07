package jp.co.softbrain.esales.commons.service.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.ImportProgress}
 * entity.
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ImportProgressDTO extends BaseDTO{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8909582987788915620L;
    
    /**
     * ImportProgress importProgressId
     */
    private Long importProgressId;
    
    /**
     * ImportProgress importId
     */
    private Long importId;
    
    /**
     * ImportProgress importStatus
     */
    private Integer importStatus;
    
    /**
     * ImportProgress importRowFinish
     */
    private Integer importRowFinish;
    
    /**
     * ImportProgress importBatchStartTime
     */
    private Instant importBatchStartTime;
    
    /**
     * ImportProgress importBatchFinishTime
     */
    private Instant importBatchFinishTime;
    
}
