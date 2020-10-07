package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

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

import jp.co.softbrain.esales.commons.service.dto.ResultExportDataAccessLogsDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultGetDataAccessLogsDTO;
import lombok.Data;

/**
 * A AccessLog.
 *
 * @author DatDV
 */
@Entity
@Table(name = "access_log")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@SqlResultSetMapping(name = "getResultListAccessLogs", classes = {
        @ConstructorResult(targetClass = ResultGetDataAccessLogsDTO.class, columns = {
                @ColumnResult(name = "access_log_id", type = Long.class),
                @ColumnResult(name = "date_time", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "account_name", type = String.class),
                @ColumnResult(name = "ip_address", type = String.class),
                @ColumnResult(name = "event", type = String.class), @ColumnResult(name = "result", type = String.class),
                @ColumnResult(name = "error_information", type = String.class),
                @ColumnResult(name = "entity_id", type = Long.class),
                @ColumnResult(name = "additional_information", type = String.class) }) })
@SqlResultSetMapping(name = "getResultListExportAccessLogs", classes = {
        @ConstructorResult(targetClass = ResultExportDataAccessLogsDTO.class, columns = {
                @ColumnResult(name = "event", type = String.class),
                @ColumnResult(name = "ip_address", type = String.class),
                @ColumnResult(name = "date_time", type = String.class),
                @ColumnResult(name = "entity_id", type = String.class),
                @ColumnResult(name = "result", type = String.class),
                @ColumnResult(name = "additional_information", type = String.class),
                @ColumnResult(name = "error_information", type = String.class),
                @ColumnResult(name = "account_name", type = String.class) }) })
public class AccessLog extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * accessLogId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "access_log_sequence_generator")
    @SequenceGenerator(name = "access_log_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "access_log_id", nullable = false)
    private Long accessLogId;

    /**
     * content
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "content")
    private String content;

}
