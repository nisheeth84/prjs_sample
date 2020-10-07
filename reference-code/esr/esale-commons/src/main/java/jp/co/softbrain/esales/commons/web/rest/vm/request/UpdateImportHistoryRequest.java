package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update import history request
 *
 * @author LongNV
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateImportHistoryRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3273418629489477772L;
    
    /**
     * importId
     */
    private Long importId;
    
    /**
     * isImportSucceed
     */
    private Boolean isImportSucceed;
    
    /**
     * errorCount
     */
    private Long errorCount;
    
    /**
     * insertedCount
     */
    private Long insertedCount;
    
    /**
     * updatedCount
     */
    private Long updatedCount;
    
    /**
     * importErrorFilePath
     */
    private String importErrorFilePath;
}
