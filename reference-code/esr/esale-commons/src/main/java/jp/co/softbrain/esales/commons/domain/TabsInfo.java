package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A TabsInfo
 * 
 * @author buithingocanh
 */
@Entity
@Table(name = "tab_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "TabsInfoMapping", classes = {
        @ConstructorResult(targetClass = TabsInfoDTO.class, columns = {
                @ColumnResult(name = "tab_info_id", type = Long.class),
                @ColumnResult(name = "tab_id", type = Integer.class),
                @ColumnResult(name = "tab_label", type = String.class),
                @ColumnResult(name = "tab_order", type = Integer.class),
                @ColumnResult(name = "is_display", type = Boolean.class),
                @ColumnResult(name = "is_display_summary", type = Boolean.class),
                @ColumnResult(name = "max_record", type = Integer.class),
                @ColumnResult(name = "updated_date", type = Instant.class)}) })
public class TabsInfo extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 4190421677208743200L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tab_info_sequence_generator")
    @SequenceGenerator(name = "tab_info_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "tab_info_id", nullable = false, unique = true)
    private Long tabInfoId;

    @NotNull
    @Column(name = "tab_belong", nullable = false)
    private Integer tabBelong;

    @NotNull
    @Column(name = "tab_id", nullable = false)
    private Integer tabId;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "tab_label", columnDefinition = "jsonb")
    private String tabLabel;

    @Column(name = "tab_order")
    private Integer tabOrder;

    @Column(name = "is_display")
    private Boolean isDisplay;

    @Column(name = "is_display_summary")
    private Boolean isDisplaySummary;

    @Column(name = "max_record")
    private Integer maxRecord;

}
