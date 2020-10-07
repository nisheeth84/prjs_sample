
package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;
import java.util.List;

/**
 * @author TuanDV
 */
public class SecurityCheckReportResultDto implements Serializable {
    private static final long serialVersionUID = 8499327057086771672L;
    private List<SecurityCheckSectionDto> lsSecurityCheckSectionDto;

    public SecurityCheckReportResultDto() {
    }

    // Constructor
    public SecurityCheckReportResultDto(List<SecurityCheckSectionDto> lsSecurityCheckSectionDto) {
        this.lsSecurityCheckSectionDto = lsSecurityCheckSectionDto;
    }

    // Getter & Setter
    public List<SecurityCheckSectionDto> getLsSecurityCheckSectionDto() {
        return lsSecurityCheckSectionDto;
    }

    public void setLsSecurityCheckSectionDto(List<SecurityCheckSectionDto> lsSecurityCheckSectionDto) {
        this.lsSecurityCheckSectionDto = lsSecurityCheckSectionDto;
    }
}
