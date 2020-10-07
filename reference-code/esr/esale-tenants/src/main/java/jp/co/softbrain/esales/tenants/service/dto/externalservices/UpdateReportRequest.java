package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API update-report
 *
 * @author tongminhcuong
 */
@Data
public class UpdateReportRequest implements Serializable {

    private static final long serialVersionUID = 7781101180941489610L;

    private Long reportId;

    private Long dataSourceId;

    private Long reportCategoryId;

    private String quickSightId;

    private String templateId;

    private String dashboardId;
}
