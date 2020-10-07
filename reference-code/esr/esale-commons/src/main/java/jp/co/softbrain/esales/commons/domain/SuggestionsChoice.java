package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

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
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.commons.service.dto.GetEmployeeSuggestionsChoiceDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The SuggestionsChoice entity.
 *
 * @author chungochai
 */
@Entity
@Table(name = "suggestions_choice")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetEmployeeSuggestionsChoiceMapping", classes = {
        @ConstructorResult(targetClass = GetEmployeeSuggestionsChoiceDTO.class, columns = {
                @ColumnResult(name = "suggestions_choice_id", type = Long.class),
                @ColumnResult(name = "index", type = String.class),
                @ColumnResult(name = "id_result", type = Long.class) }) 
        })
public class SuggestionsChoice extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -6809062355747281466L;

    /**
     * The DataChange serviceId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "suggestions_choice_sequence_generator")
    @SequenceGenerator(name = "suggestions_choice_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "suggestions_choice_id", nullable = false)
    private Long suggestionsChoiceId;

    @Column(name = "index")
    private String index;

    @Column(name = "id_result")
    private Long idResult;

    @Column(name = "employee_id")
    private Long employeeId;

}
