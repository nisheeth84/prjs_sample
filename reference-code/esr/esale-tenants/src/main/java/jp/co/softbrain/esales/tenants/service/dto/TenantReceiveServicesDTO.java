package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for tenant service.
 *
 * @author lehuuhoa
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TenantReceiveServicesDTO  extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 6819110050218842619L;

    private Long tenantId;

    private String tenantName;

    private String companyName;

    private Long mIndustryId;

    private Integer creationStatus;

    private Integer contractStatus;

    private Boolean isActive;

    private String contractId;

    private Date trialEndDate;

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

    private Instant deletedDate;

    private Long businessMainId;

    private Long businessSubId;

    private String email;
}
