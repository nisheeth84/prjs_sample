package jp.co.softbrain.esales.tenants.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The license_packages entity.
 */
@Entity
@Table(name = "license_packages")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class LicensePackages extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -2230479770189589307L;

    /**
     * The id of License packages
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "license_packages_sequence_generator")
    @SequenceGenerator(name = "license_packages_sequence_generator", allocationSize = 1)
    @Column(name = "license_id", nullable = false)
    private Long licenseId;

    /**
     * The is of master package
     */
    @Column(name = "m_package_id", nullable = false)
    private Long mPackageId;

    /**
     * The id of Tenant
     */
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    /**
     * The number of available license
     */
    @Column(name = "available_license_number", nullable = false)
    private Integer availableLicenseNumber;
}
