package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import lombok.Data;

import java.io.Serializable;

/**
 * ReportForCreatingDashboardDTO model
 *
 * @author tongminhcuong
 */
@Data
public class ReportForCreatingDashboardDTO implements Serializable {

    private static final long serialVersionUID = -6172039707916644410L;

    private Long reportId;

    private Long dataSourceId;

    private String quickSightId;

    private String templateId;

    private String dataSetARN;

    private String dataSourceName;
}
