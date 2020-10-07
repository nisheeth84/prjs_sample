package jp.co.softbrain.esales.tenants.domain;

import jp.co.softbrain.esales.tenants.service.dto.TemplateMicroServiceDTO;
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
import java.time.Instant;

/**
 * The MTemplates entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "m_templates")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "TemplateMicroServiceMapping", classes = {
    @ConstructorResult(targetClass = TemplateMicroServiceDTO.class, columns = {
        @ColumnResult(name = "m_template_id", type = Long.class),
        @ColumnResult(name = "file_name", type = String.class),
        @ColumnResult(name = "updated_date", type = Instant.class),
        @ColumnResult(name = "micro_service_name", type = String.class)
    })
})
public class MTemplates extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -2434147952290482272L;

    @Id
    @Column(name = "m_template_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "m_templates_sequence_generator")
    @SequenceGenerator(name = "m_templates_sequence_generator", allocationSize = 1)
    private Long mTemplateId;

    @Column(name = "micro_service_name", nullable = false)
    private String microServiceName;

    @Column(name = "m_industry_id", nullable = false)
    private Long mIndustryId;

    @Column(name = "file_name")
    private String fileName;
}
