package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;
import java.util.List;

/**
 * @author TuanDV
 */
public class SecurityCheckReportSummaryDto implements Serializable {
    private static final long serialVersionUID = -6456617781109890477L;
    private String executeDateTime;
    private String organizationName;
    private String projectName;
    private List<AwsAccountsDto> lsAwsAccountsDto;

    // Getter & Setter
    public String getExecuteDateTime() {
        return executeDateTime;
    }

    public void setExecuteDateTime(String executeDateTime) {
        this.executeDateTime = executeDateTime;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public List<AwsAccountsDto> getLsAwsAccountsDto() {
        return lsAwsAccountsDto;
    }

    public void setLsAwsAccountsDto(List<AwsAccountsDto> lsAwsAccountsDto) {
        this.lsAwsAccountsDto = lsAwsAccountsDto;
    }
}
