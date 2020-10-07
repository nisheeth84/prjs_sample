package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;
import java.util.List;

/**
 * @author TuanDV
 */
public class SecurityCheckReportDto implements Serializable {
    private static final long serialVersionUID = -6456617781109890477L;
    private List<SecurityCheckReportSummaryDto> lsSecurityCheckReportSummaryDto;
    private List<SecurityCheckReportResultDto> lsCisSecurityCheckReportResultDto;
    private List<SecurityCheckReportResultDto> lsAscSecurityCheckReportResultDto;
    private List<SecurityCheckReportResultDto> lsIbpSecurityCheckReportResultDto;
    private String executedDateTime;

    public SecurityCheckReportDto() {
    }

    // Constructor
    public SecurityCheckReportDto(List<SecurityCheckReportSummaryDto> lsSecurityCheckReportSummaryDto,
            List<SecurityCheckReportResultDto> lsCisSecurityCheckReportResultDto,
            List<SecurityCheckReportResultDto> lsAscSecurityCheckReportResultDto,
            List<SecurityCheckReportResultDto> lsIbpSecurityCheckReportResultDto, String executedDateTime) {
        this.lsSecurityCheckReportSummaryDto = lsSecurityCheckReportSummaryDto;
        this.lsCisSecurityCheckReportResultDto = lsCisSecurityCheckReportResultDto;
        this.lsAscSecurityCheckReportResultDto = lsAscSecurityCheckReportResultDto;
        this.lsIbpSecurityCheckReportResultDto = lsIbpSecurityCheckReportResultDto;
        this.executedDateTime = executedDateTime;
    }

    // Getter & Setter
    public List<SecurityCheckReportSummaryDto> getLsSecurityCheckReportSummaryDto() {
        return lsSecurityCheckReportSummaryDto;
    }

    public void setLsSecurityCheckReportSummaryDto(
            List<SecurityCheckReportSummaryDto> lsSecurityCheckReportSummaryDto) {
        this.lsSecurityCheckReportSummaryDto = lsSecurityCheckReportSummaryDto;
    }

    public String getExecutedDateTime() {
        return executedDateTime;
    }

    public void setExecutedDateTime(String executedDateTime) {
        this.executedDateTime = executedDateTime;
    }

    public List<SecurityCheckReportResultDto> getLsCisSecurityCheckReportResultDto() {
        return lsCisSecurityCheckReportResultDto;
    }

    public void setLsCisSecurityCheckReportResultDto(
            List<SecurityCheckReportResultDto> lsCisSecurityCheckReportResultDto) {
        this.lsCisSecurityCheckReportResultDto = lsCisSecurityCheckReportResultDto;
    }

    public List<SecurityCheckReportResultDto> getLsAscSecurityCheckReportResultDto() {
        return lsAscSecurityCheckReportResultDto;
    }

    public void setLsAscSecurityCheckReportResultDto(
            List<SecurityCheckReportResultDto> lsAscSecurityCheckReportResultDto) {
        this.lsAscSecurityCheckReportResultDto = lsAscSecurityCheckReportResultDto;
    }

    public List<SecurityCheckReportResultDto> getLsIbpSecurityCheckReportResultDto() {
        return lsIbpSecurityCheckReportResultDto;
    }

    public void setLsIbpSecurityCheckReportResultDto(
            List<SecurityCheckReportResultDto> lsIbpSecurityCheckReportResultDto) {
        this.lsIbpSecurityCheckReportResultDto = lsIbpSecurityCheckReportResultDto;
    }
}
