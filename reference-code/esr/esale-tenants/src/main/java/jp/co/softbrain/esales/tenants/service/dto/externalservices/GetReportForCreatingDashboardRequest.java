package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API get-report-for-creating-dashboard
 *
 * @author tongminhcuong
 */
@Data
public class GetReportForCreatingDashboardRequest implements Serializable {

    private static final long serialVersionUID = -689943498622938906L;

    private Long dataSourceId;
}
