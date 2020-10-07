package jp.co.softbrain.esales.tenants.domain;

import java.io.Serializable;
import java.sql.Date;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantByConditionDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Tenants entity.
 * @author phamhoainam
 */
@Entity
@Table(name = "tenants")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "TenantServicesMapping", classes = {
        @ConstructorResult(targetClass = TenantNameDTO.class, columns = {
                @ColumnResult(name = "tenant_id", type = Long.class),
                @ColumnResult(name = "tenant_name", type = String.class)
        })
})

@SqlResultSetMapping(name = "TenantByConditionMapping", classes = {
        @ConstructorResult(targetClass = TenantByConditionDTO.class, columns = {
                @ColumnResult(name = "tenant_name", type = String.class),
                @ColumnResult(name = "company_name", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})

@SqlResultSetMapping(name = "TenantActiveMapping", classes = {
        @ConstructorResult(targetClass = TenantActiveDTO.class, columns = {
            @ColumnResult(name = "tenant_id", type = Long.class),
            @ColumnResult(name = "tenant_name")
        })
})

@SqlResultSetMapping(name = "TenantNameByIDsMapping", classes = {
        @ConstructorResult(targetClass = TenantNameDTO.class, columns = {
                @ColumnResult(name = "tenant_id", type = Long.class),
                @ColumnResult(name = "tenant_name", type = String.class),
                @ColumnResult(name = "user_pool_id", type = String.class)
        })
})

public class Tenants extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -8377798910687710756L;

    @Id
    @Column(name = "tenant_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tenants_sequence_generator")
    @SequenceGenerator(name = "tenants_sequence_generator", allocationSize = 1)
    private Long tenantId;

    @Column(name = "tenant_name")
    private String tenantName;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "m_industry_id", nullable = false)
    private Long mIndustryId;

    @Column(name = "creation_status")
    private Integer creationStatus;

    @Column(name = "contract_status")
    private Integer contractStatus;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Size(max = 100)
    @Column(name = "contract_id", length = 100, nullable = false)
    private String contractId;

    @Column(name = "trial_end_date")
    private Date trialEndDate;

    @Size(max = 50)
    @Column(name = "department_name", length = 50)
    private String departmentName;

    @Column(name = "position_name")
    private String positionName;

    @Size(max = 100)
    @Column(name = "employee_surname", length = 100, nullable = false)
    private String employeeSurname;

    @Size(max = 100)
    @Column(name = "employee_name", length = 100)
    private String employeeName;

    @Size(max = 20)
    @Column(name = "telephone_number", length = 20)
    private String telephoneNumber;

    @Size(max = 100)
    @Column(name = "password", length = 100, nullable = false)
    private String password;

    @Column(name = "account_closing_month")
    private Integer accountClosingMonth;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "calendar_day")
    private Integer calendarDay;

    @Column(name = "business_main_id", nullable = false)
    private Long businessMainId;

    @Column(name = "business_sub_id", nullable = false)
    private Long businessSubId;

    @Column(name = "stop_date")
    private Instant stopDate;

    @Column(name = "deleted_date")
    private Instant deletedDate;

    @Size(max = 50)
    @Column(name = "email", length = 50, nullable = false)
    private String email;
}
