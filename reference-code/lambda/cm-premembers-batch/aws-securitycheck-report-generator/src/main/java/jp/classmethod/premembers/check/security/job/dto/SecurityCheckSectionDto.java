package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;
import java.util.List;

/**
 * @author TuanDV
 */
public class SecurityCheckSectionDto implements Serializable {
    private static final long serialVersionUID = 8499327057086771672L;
    private String executeDateTime;
    private String organizationName;
    private String projectName;
    private String awsAccount;
    private String sectionTitle;
    private Boolean isAssessment = false;
    private Boolean isExclusion = false;
    private List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDto;

    public SecurityCheckSectionDto() {
    }

    // Constructor
    public SecurityCheckSectionDto(String executeDateTime, String organizationName, String projectName,
            String awsAccount, String sectionTitle, List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDto,
            Boolean isAssessment, Boolean isExclusion) {
        this.executeDateTime = executeDateTime;
        this.organizationName = organizationName;
        this.projectName = projectName;
        this.awsAccount = awsAccount;
        this.sectionTitle = sectionTitle;
        this.lsSecurityCheckItemDetailsDto = lsSecurityCheckItemDetailsDto;
        this.isAssessment = isAssessment;
        this.isExclusion = isExclusion;
    }

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

    public String getAwsAccount() {
        return awsAccount;
    }

    public void setAwsAccount(String awsAccount) {
        this.awsAccount = awsAccount;
    }

    public String getSectionTitle() {
        return sectionTitle;
    }

    public void setSectionTitle(String sectionTitle) {
        this.sectionTitle = sectionTitle;
    }

    public List<SecurityCheckItemDetailsDto> getLsSecurityCheckItemDetailsDto() {
        return lsSecurityCheckItemDetailsDto;
    }

    public void setLsSecurityCheckItemDetailsDto(List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDto) {
        this.lsSecurityCheckItemDetailsDto = lsSecurityCheckItemDetailsDto;
    }

    public Boolean getIsAssessment() {
        return isAssessment;
    }

    public void setIsAssessment(Boolean isAssessment) {
        this.isAssessment = isAssessment;
    }

    public Boolean getIsExclusion() {
        return isExclusion;
    }

    public void setIsExclusion(Boolean isExclusion) {
        this.isExclusion = isExclusion;
    }
}
