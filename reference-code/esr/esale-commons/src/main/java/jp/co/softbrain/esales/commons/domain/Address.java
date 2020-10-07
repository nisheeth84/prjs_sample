package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Addresses entity.
 *
 * @author chungochai
 */
@Entity
@Table(name = "address")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class Address extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -2429635185659016723L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "address_sequence_generator")
    @SequenceGenerator(name = "address_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "address_id", nullable = false)
    private Long addressId;

    @NotNull
    @Size(max = 8)
    @Column(name = "zip_code", nullable = false, length = 8)
    private String zipCode;

    @NotNull
    @Size(max = 100)
    @Column(name = "prefecture_name", nullable = false, length = 100)
    private String prefectureName;

    @NotNull
    @Size(max = 100)
    @Column(name = "city_name", nullable = false, length = 100)
    private String cityName;

    @NotNull
    @Size(max = 100)
    @Column(name = "area_name", nullable = false, length = 100)
    private String areaName;

}
