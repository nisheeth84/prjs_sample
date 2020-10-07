package jp.co.softbrain.esales.tenants.domain;

import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

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
import java.io.Serializable;

/**
 * The MIndustries entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "m_industries")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "IndustryMapping", classes = {
    @ConstructorResult(targetClass = IndustryDTO.class, columns = {
        @ColumnResult(name = "m_industry_id", type = Long.class),
        @ColumnResult(name = "industry_type_name", type = String.class),
        @ColumnResult(name = "schema_name", type = String.class)
    })
})

public class MIndustries extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -7866606924484080999L;

    @Id
    @Column(name = "m_industry_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "m_industries_sequence_generator")
    @SequenceGenerator(name = "m_industries_sequence_generator", allocationSize = 1)
    private Long mIndustryId;

    @Column(name = "industry_type_name", nullable = false)
    private String industryTypeName;

    @Column(name = "industry_type_name_jp", nullable = false)
    private String industryTypeNameJp;

    @Column(name = "schema_name", nullable = false)
    private String schemaName;
}
