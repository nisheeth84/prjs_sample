package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetImportHistoriesDTO
 *
 * @author LongNV
 *
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetImportHistoriesDTO implements Serializable {

    private static final long serialVersionUID = -5980238778231797517L;

    /**
     * The importFileName
     */
    private String importFileName;

    /**
     * The importFilePath
     */
    private String importFilePath;

    /**
     * The importId
     */
    private Long importId;

    /**
     * The errorCount
     */
    private Long errorCount;

    /**
     * The insertedCount
     */
    private Long insertedCount;

    /**
     * The updatedCount
     */
    private Long updatedCount;

    /**
     * The importErrorFilePath
     */
    private String importErrorFilePath;

    /**
     * The createdDate
     */
    private Instant createdDate = Instant.now();

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate = Instant.now();

    /**
     * The updatedUser
     */
    private Long updatedUser;

}
