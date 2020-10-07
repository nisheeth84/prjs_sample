package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Tenant that is contains info that are needed to initiate environment
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenantEnvironmentDTO implements Serializable {

    private static final long serialVersionUID = -5832140304450416127L;

    private String contractId;

    private Long mIndustryId;

    private String industryTypeName;

    private String schemaName;

    private Integer creationStatus;

    private String tenantName;

    private String email;

    private String companyName;

    private String departmentName;

    private String positionName;

    private String employeeSurname;

    private String employeeName;

    private String telephoneNumber;

    private String password;

    private Integer accountClosingMonth;

    private String productName;

    private String customerName;

    private Integer calendarDay;

    private Long businessMainId;

    private Long businessSubId;
}
