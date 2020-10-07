package jp.co.softbrain.esales.employees.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.EntityResult;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupAndGroupMemberDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupAutoUpdateDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType4;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsDataDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupSelectedOrganizationDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A EmployeesGroups.
 */
@Entity
@Table(name = "employees_groups")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "EmployeesGroupAutoUpdateDTOMapping", classes = {
        @ConstructorResult(targetClass = EmployeesGroupAutoUpdateDTO.class,
                columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name"),
                @ColumnResult(name = "group_type", type = Integer.class),
                @ColumnResult(name = "is_auto_group", type = Boolean.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "display_order", type = Integer.class),
                @ColumnResult(name = "search_content_id", type = Long.class),
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "search_type", type = Integer.class),
                @ColumnResult(name = "search_option", type = Integer.class),
                @ColumnResult(name = "search_value", type = String.class),
                @ColumnResult(name = "time_zone_offset", type = Integer.class),
        })
})
@SqlResultSetMapping(name = "EmployeesGroupsCommonMapping", classes = {
        @ConstructorResult(targetClass = EmployeesGroupsDTO.class,
                columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name"),
                @ColumnResult(name = "group_type", type = Integer.class),
                @ColumnResult(name = "is_auto_group", type = Boolean.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "display_order", type = Integer.class),
                @ColumnResult(name = "last_updated_date", type = Instant.class),
                @ColumnResult(name = "participant_type", type = Integer.class)
        })
})
@SqlResultSetMapping(name = "GetEmployeesSuggestionSubType4Mapping", classes = {
        @ConstructorResult(targetClass = GetEmployeesSuggestionSubType4.class,
                columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name"),
                @ColumnResult(name = "is_auto_group", type = Boolean.class),
                @ColumnResult(name = "employee_id", type = Long.class)
        })
})
@SqlResultSetMapping(name = "EmployeeGroupAndGroupMemberDTOMapping", classes = {
        @ConstructorResult(targetClass = EmployeeGroupAndGroupMemberDTO.class,
                columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name", type = String.class),
                @ColumnResult(name = "group_type", type = Integer.class),
                @ColumnResult(name = "is_auto_group", type = Boolean.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})
@SqlResultSetMapping(name = "GroupSelectedOrganization", classes = {
        @ConstructorResult(targetClass = GroupSelectedOrganizationDTO.class,
                columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
        })
})
@SqlResultSetMapping(name = "EmployeeGroupByOwnerMapping", classes = {
        @ConstructorResult(targetClass = GetGroupSuggestionsDataDTO.class, columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name"),
                @ColumnResult(name = "group_type", type = Integer.class),
                @ColumnResult(name = "is_auto_group", type = Boolean.class),
                @ColumnResult(name = "last_updated_date", type = Instant.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "employee_surname"),
                @ColumnResult(name = "created_user_name")
        })
})
@SqlResultSetMapping(name = "ListOrGroupWithOnlyOneOwnerMapping", classes = {
        @ConstructorResult(targetClass = GetOrganizationGroupDTO.class, columns = {
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "group_name")
        })
})
@SqlResultSetMapping(name = "EmployeesGroupsEntityMapping", entities = {
        @EntityResult(entityClass = EmployeesGroups.class) })
@SqlResultSetMapping(name = "GroupsByGroupParticipantMapping", classes = {
        @ConstructorResult(targetClass = EmployeesGroupsDTO.class, columns = {
                @ColumnResult(name = "group_id", type = Long.class), @ColumnResult(name = "group_name"),
                @ColumnResult(name = "group_type", type = Integer.class),
                @ColumnResult(name = "is_auto_group", type = Boolean.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "display_order", type = Integer.class),
                @ColumnResult(name = "last_updated_date", type = Instant.class),
                @ColumnResult(name = "participant_type", type = Integer.class) }) })
public class EmployeesGroups extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 4639686962590097710L;

    /**
     * The EmployeesGroups groupId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_groups_sequence_generator")
    @SequenceGenerator(name = "employees_groups_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "group_id", nullable = false, unique = true)
    private Long groupId;

    /**
     * The EmployeesGroups groupName
     */
    @NotNull
    @Size(max = 50)
    @Column(name = "group_name", length = 50, nullable = false)
    private String groupName;

    /**
     * The EmployeesGroups groupType
     */
    @Column(name = "group_type")
    private Integer groupType;

    /**
     * The EmployeesGroups isAutoGroup
     */
    @Column(name = "is_auto_group")
    private Boolean isAutoGroup;

    /**
     * The EmployeesGroups isOverWrite
     */
    @Column(name = "is_over_write")
    private Boolean isOverWrite;

    /**
     * The EmployeesGroups displayOrder
     */
    @Column(name = "display_order")
    private Integer displayOrder;

    /**
     * The EmployeesGroups lastUpdatedDate
     */
    @Column(name = "last_updated_date")
    private Instant lastUpdatedDate;
}
