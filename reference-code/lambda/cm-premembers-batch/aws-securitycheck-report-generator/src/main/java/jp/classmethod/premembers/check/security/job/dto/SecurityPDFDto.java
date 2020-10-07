package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;
import java.util.List;

/**
 * @author TuanDV
 */
public class SecurityPDFDto implements Serializable {
    private static final long serialVersionUID = -4318448135362807430L;
    private List<SecurityCheckReportDto> lsSecurityCheckReportDto;

    public SecurityPDFDto() {
    }

    // Constructor
    public SecurityPDFDto(List<SecurityCheckReportDto> lsSecurityCheckReportDto) {
        super();
        this.lsSecurityCheckReportDto = lsSecurityCheckReportDto;
    }

    // Getter & Setter
    public List<SecurityCheckReportDto> getLsSecurityCheckReportDto() {
        return lsSecurityCheckReportDto;
    }

    public void setLsSecurityCheckReportDto(List<SecurityCheckReportDto> lsSecurityCheckReportDto) {
        this.lsSecurityCheckReportDto = lsSecurityCheckReportDto;
    }
}
