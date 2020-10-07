package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Optional;

/**
 * DTO for get database storage.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetUsedStorageDTO implements Serializable {
    private static final long serialVersionUID = -8379798933687710686L;

    private String microServiceName;

    private Long usedStorageS3;

    private Long usedStorageElasticsearch;

    private Long usedStorageDatabase;

    /**
     * Get used database storage of micro service.
     *
     * @return total used storage of S3, elasticsearch and database.
     */
    public long getUsedStorage(){
        long storageS3 = Optional.ofNullable(this.usedStorageS3).orElse(0L);
        long storageElasticsearch = Optional.ofNullable(this.usedStorageElasticsearch).orElse(0L);
        long storageDatabase = Optional.ofNullable(this.usedStorageDatabase).orElse(0L);
        return storageS3 + storageElasticsearch + storageDatabase;
    }
}
