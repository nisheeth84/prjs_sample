package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The ServiceInfo entity.
 * 
 * @author chungochai
 */
@Entity
@Table(name = "services_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class ServicesInfo extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 3528748288657956738L;

    /**
     * The ServiceInfo serviceId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "services_info_sequence_generator")
    @SequenceGenerator(name = "services_info_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "service_id", nullable = false)
    private Integer serviceId;

    /**
     * The ServiceInfo serviceName
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @NotNull
    @Column(name = "service_name", columnDefinition = "jsonb", nullable = false)
    private String serviceName;

    /**
     * The ServiceInfo serviceType
     */
    @NotNull
    @Column(name = "service_type", nullable = false)
    private Integer serviceType;

    /**
     * The ServiceInfo serviceOrder
     */
    @NotNull
    @Column(name = "service_order", nullable = false)
    private Integer serviceOrder;
    
    @Column(name = "icon_path")
    private String iconPath;
    
    @Column(name = "service_path")
    private String servicePath;
    
    /**
     * The ServiceInfo lookupAvailableFlag
     */
    @NotNull
    @Column(name = "lookup_available_flag", nullable = false)
    private Integer lookupAvailableFlag;
    
    /**
     * The ServiceInfo relationAvailableFlag
     */
    @NotNull
    @Column(name = "relation_available_flag", nullable = false)
    private Integer relationAvailableFlag;
}
