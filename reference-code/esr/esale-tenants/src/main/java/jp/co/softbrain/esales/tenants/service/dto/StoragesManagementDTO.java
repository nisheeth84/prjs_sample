package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for get database storage.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StoragesManagementDTO extends BaseDTO implements Serializable {
    private static final long serialVersionUID = -8379798933678710686L;

    private Long storageManagementId;

    private Long tenantId;

    private String microServiceName;

    private Long usedStorageS3;

    private Long usedStorageElasticsearch;

    private Long usedStorageDatabase;
}
