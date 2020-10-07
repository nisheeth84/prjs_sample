package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API update-data-source-sync
 *
 * @author tongminhcuong
 */
@Data
public class UpdateDataSourceSyncRequest implements Serializable {

    private static final long serialVersionUID = 1644695007070847976L;

    private Long dataSourceId;

    private String dataSetArn;

    private Integer syncStatus;
}
