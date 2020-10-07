package jp.co.softbrain.esales.commons.web.rest.vm.request;

import jp.co.softbrain.esales.commons.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.Instant;


/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.ImportHistories} entity.
 *
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ImportHistoriesRequestDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -5980238778231797517L;

    private Long importHistoryId;

    private Integer importBelong;

    private MultipartFile file;

    private Boolean isSimulationMode;

    private Integer importAction;

    private Boolean isDuplicateAllowed;

    private String mappingItem;

    private String matchingKey;

    private String matchingRelation;

    private Integer batchActivateMode;

    private Boolean isImportSucceed;

    private Long importFileRecordTotal;

    private Instant importBatchStartTime;

    private Instant importBatchFinishTime;

    private Long errorCount;

    private Long insertedCount;

    private Long updatedCount;

    private String importErrorFilePath;

    private String noticeList;

    private Boolean isAutoPostTimeline;

    private Long listId;

    private String employeeName;
}
