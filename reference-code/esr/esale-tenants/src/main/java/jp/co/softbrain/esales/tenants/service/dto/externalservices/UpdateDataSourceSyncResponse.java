package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API update-data-source-sync
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDataSourceSyncResponse implements Serializable {

    private static final long serialVersionUID = -9195437511882311285L;

    private Long dataSourceId;
}
