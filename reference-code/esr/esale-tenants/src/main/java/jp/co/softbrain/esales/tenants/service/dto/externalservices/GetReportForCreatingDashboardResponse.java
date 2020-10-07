package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API get-report-for-creating-dashboard
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetReportForCreatingDashboardResponse implements Serializable {

    private static final long serialVersionUID = 7178507945998126882L;

    private List<ReportForCreatingDashboardDTO> reports;
}
