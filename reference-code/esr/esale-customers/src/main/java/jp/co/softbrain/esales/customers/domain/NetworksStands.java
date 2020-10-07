package jp.co.softbrain.esales.customers.domain;

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
 * The networks_stands entity
 *
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "networks_stands")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class NetworksStands extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * networkStandId
     */
    @Id
    @NotNull
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "network_stands_sequence_generator")
    @SequenceGenerator(name = "network_stands_sequence_generator", allocationSize = 1)
    @Column(name = "network_stand_id", nullable = false, unique = true)
    private Long networkStandId;

    /**
     * businessCardCompanyId
     */
    @NotNull
    @Column(name = "business_card_company_id")
    private Long businessCardCompanyId;

    /**
     * businessCardDepartmentId
     */
    @NotNull
    @Column(name = "business_card_department_id")
    private Long businessCardDepartmentId;

    /**
     * businessCardId
     */
    @NotNull
    @Column(name = "business_card_id")
    private Long businessCardId;

    /**
     * standId
     */
    @Column(name = "stand_id")
    private Long standId;

    /**
     * motivationId
     */
    @Column(name = "motivation_id")
    private Long motivationId;

    /**
     * productTradingId
     */
    @Column(name = "product_trading_id")
    private Long productTradingId;

    /**
     * comment
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "comment", columnDefinition = "text")
    private String comment;

}
