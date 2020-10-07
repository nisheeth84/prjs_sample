package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.ImportHistories} entity.
 *
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ImportHistoriesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -5980238778231797517L;

    private String importFileName;

    private String importFilePath;

    private Long errorCount;

    private Long insertedCount;

    private Long updatedCount;

    private String importErrorFilePath;

    private String employeeName;
    
    private Long importId;
}
