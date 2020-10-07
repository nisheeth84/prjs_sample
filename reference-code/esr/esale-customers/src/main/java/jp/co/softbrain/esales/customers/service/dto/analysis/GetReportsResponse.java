package jp.co.softbrain.esales.customers.service.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Data
public class GetReportsResponse implements Serializable {
    private static final long serialVersionUID = -7023260027330138782L;

    private List<ReportDTO> reports;

    private List<ReportCategoryDTO> reportCategories;

    private Integer totalCount;

    @Data
    public static class ReportDTO implements Serializable {
        private static final long serialVersionUID = -3516015798463180245L;
        private Long reportId;
        private String reportName;
        private Long dataSetId;
        private String quickSightId;
        private String templateId;
        private String dashboardId;
        private Instant createdDate;
        private Instant updatedDate;
    }

    @Data
    @AllArgsConstructor
    public static class ReportCategoryDTO implements Serializable {
        private static final long serialVersionUID = -8874572589054839409L;
        private Long reportCategoryId;
        private String reportCategoryName;
        private Integer displayOrder;

    }
}
