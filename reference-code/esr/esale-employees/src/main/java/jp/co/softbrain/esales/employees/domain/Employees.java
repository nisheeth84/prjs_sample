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
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.hibernate.type.TextType;

import jp.co.softbrain.esales.employees.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeBasicDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsGroupsMembersDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSummaryDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalSubType2DTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeesDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Employees entity.
 */
@Entity
@Table(name = "employees")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "SelectEmployeesDTOMapping", classes = {
        @ConstructorResult(targetClass = SelectEmployeesDTO.class, columns = {
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "photo_file_name"),
                @ColumnResult(name = "photo_file_path"),
                @ColumnResult(name = "employee_surname"),
                @ColumnResult(name = "employee_name"),
                @ColumnResult(name = "employee_surname_kana"),
                @ColumnResult(name = "employee_name_kana"),
                @ColumnResult(name = "email"),
                @ColumnResult(name = "telephone_number"),
                @ColumnResult(name = "cellphone_number"),
                @ColumnResult(name = "user_id"),
                @ColumnResult(name = "is_admin", type = Boolean.class),
                @ColumnResult(name = "language_id", type = Long.class),
                @ColumnResult(name = "timezone_id", type = Long.class),
                @ColumnResult(name = "format_date_id", type = Integer.class),
                @ColumnResult(name = "employee_status", type = Integer.class),
                @ColumnResult(name = "employee_data", type = TextType.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class)
        })
})
@SqlResultSetMapping(name = "GroupAndDeparmentMapping", classes = {
        @ConstructorResult(targetClass = GetGroupAndDepartmentDTO.class, columns = {
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "employee_name",type = String.class),
                @ColumnResult(name = "group_id",type = Long.class),
                @ColumnResult(name = "department_id",type = Long.class),
                @ColumnResult(name = "updated_date",type = Instant.class)
                
               
        })
})
@SqlResultSetMapping(name = "GetEmployeesSuggestionMapping", entities = {
        @EntityResult(entityClass = Employees.class)
})
@SqlResultSetMapping(name = "GetEmployeesManagersMapping", classes = {
        @ConstructorResult(targetClass = EmployeeSummaryDTO.class,
                columns = {
                @ColumnResult(name = "employeeIconPath", type = String.class),
                @ColumnResult(name = "employeeId", type = Long.class),
                @ColumnResult(name = "employeeName", type = String.class),
                @ColumnResult(name = "managerId", type = Long.class),
                @ColumnResult(name = "departmentName", type = String.class),
        })
})
@SqlResultSetMapping(name = "InitializeGroupModalSubType2Mapping", classes = {
        @ConstructorResult(targetClass = InitializeGroupModalSubType2DTO.class,
                columns = {
                        @ColumnResult(name = "employee_id", type = Long.class),
                        @ColumnResult(name = "employee_surname"),
                        @ColumnResult(name = "employee_name"),
                        @ColumnResult(name = "department_name"),
                        @ColumnResult(name = "photo_file_name"),
                        @ColumnResult(name = "photo_file_path"),
                        @ColumnResult(name = "position_id",type = Long.class),
                        @ColumnResult(name = "position_name",type = String.class)
        })
})

@SqlResultSetMapping(name = "EmployeeSelectedOrganization", classes = {
        @ConstructorResult(targetClass = EmployeeSelectedOrganizationDTO.class,
                columns = {
                        @ColumnResult(name = "employee_id", type = Long.class),
                        @ColumnResult(name = "photo_file_path", type = String.class),
                        @ColumnResult(name = "photo_file_name", type = String.class),
                        @ColumnResult(name = "employee_name", type = String.class),
                        @ColumnResult(name = "department_id", type = Long.class),
                        @ColumnResult(name = "department_name", type = String.class),
                        @ColumnResult(name = "department_order", type = Integer.class),
                        @ColumnResult(name = "position_id", type = Long.class),
                        @ColumnResult(name = "position_name", type = String.class),
                        @ColumnResult(name = "position_order", type = Integer.class),
                        @ColumnResult(name = "employee_surname", type = String.class)
        })
})

@SqlResultSetMapping(name = "CalculatorFormularDTOMapping", classes = {
        @ConstructorResult(targetClass = CalculatorFormularDTO.class,
            columns = {
                    @ColumnResult(name = "employee_id", type = Long.class),
                    @ColumnResult(name = "field_name"),
                    @ColumnResult(name = "config_value")
        })
})
@SqlResultSetMapping(name = "AllCalculatorFormularDTOMapping", classes = {
        @ConstructorResult(targetClass = CalculatorFormularDTO.class,
            columns = {
                    @ColumnResult(name = "field_name"),
                    @ColumnResult(name = "config_value")
        })
})
@SqlResultSetMapping(name = "EmployeeSyncQuickSightDTOMapping", classes = {
        @ConstructorResult(targetClass = EmployeeSyncQuickSightDTO.class,
            columns = {
                    @ColumnResult(name = "employee_id", type = Long.class),
                    @ColumnResult(name = "employee_surname", type = String.class),
                    @ColumnResult(name = "employee_name", type = String.class),
                    @ColumnResult(name = "email", type = String.class),
                    @ColumnResult(name = "employee_status", type = Integer.class),
                    @ColumnResult(name = "is_account_quicksight", type = Boolean.class),
                    @ColumnResult(name = "package_id", type = Long.class)
        })
})
@SqlResultSetMapping(name = "EmployeeOutDTOMapping", classes = {
    @ConstructorResult(targetClass = EmployeeOutDTO.class,
        columns = {
            @ColumnResult(name = "email", type = String.class),
            @ColumnResult(name = "employee_id", type = Long.class),
            @ColumnResult(name = "employee_name", type = String.class),
            @ColumnResult(name = "employee_surname", type = String.class),
            @ColumnResult(name = "employee_status", type = Integer.class)
        })
})
@SqlResultSetMapping(name = "GetBasicEmployeeMapping", classes = {
        @ConstructorResult(targetClass = EmployeeBasicDTO.class, columns = {
                @ColumnResult(name = "employee_surname", type = String.class),
                @ColumnResult(name = "employee_name", type = String.class),
                @ColumnResult(name = "employee_surname_kana", type = String.class),
                @ColumnResult(name = "employee_name_kana", type = String.class),
                @ColumnResult(name = "email", type = String.class),
                @ColumnResult(name = "telephone_number", type = String.class),
                @ColumnResult(name = "cellphone_number", type = String.class),
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "department_name", type = String.class),
                @ColumnResult(name = "department_order", type = Integer.class),
                @ColumnResult(name = "position_id", type = Long.class),
                @ColumnResult(name = "position_name", type = String.class),
                @ColumnResult(name = "position_order", type = Integer.class) }) })
@SqlResultSetMapping(name = "DepartmentsGroupsMembersDTOMapping", classes = {
        @ConstructorResult(targetClass = DepartmentsGroupsMembersDTO.class, columns = {
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "email", type = String.class),
                @ColumnResult(name = "employee_status", type = Integer.class),
                @ColumnResult(name = "employee_name", type = String.class),
                @ColumnResult(name = "employee_surname", type = String.class),
                @ColumnResult(name = "employee_full_name", type = String.class),
                @ColumnResult(name = "photo_file_name", type = String.class),
                @ColumnResult(name = "photo_file_path", type = String.class),
                @ColumnResult(name = "photo_file_url", type = String.class),
                @ColumnResult(name = "org_id", type = Long.class) }) })
public class Employees extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -2794130449403469266L;

    /**
     * The Employees employeeId
     */
    @Id
    @Column(name = "employee_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_sequence_generator")
    @SequenceGenerator(name = "employees_sequence_generator", allocationSize = 1)
    private Long employeeId;

    /**
     * The Employees photoFileName
     */
    @Column(name = "photo_file_name")
    private String photoFileName;

    /**
     * The Employees photoFilePath
     */
    @Column(name = "photo_file_path")
    private String photoFilePath;

    /**
     * The Employees employeeSurname
     */
    @Size(max = 100)
    @Column(name = "employee_surname", length = 100)
    private String employeeSurname;

    /**
     * The Employees employeeName
     */
    @Size(max = 100)
    @Column(name = "employee_name", length = 100)
    private String employeeName;

    /**
     * The Employees employeeSurnameKana
     */
    @Size(max = 100)
    @Column(name = "employee_surname_kana", length = 100)
    private String employeeSurnameKana;

    /**
     * The Employees employeeNameKana
     */
    @Size(max = 100)
    @Column(name = "employee_name_kana", length = 100)
    private String employeeNameKana;

    /**
     * The Employees email
     */
    @Size(max = 50)
    @Column(name = "email", length = 50)
    private String email;

    /**
     * The Employees cellphoneNumber
     */
    @Size(max = 20)
    @Column(name = "telephone_number", length = 20)
    private String telephoneNumber;

    /**
     * The Employees cellphoneNumber
     */
    @Size(max = 20)
    @Column(name = "cellphone_number", length = 20)
    private String cellphoneNumber;

    /**
     * The Employees userId
     */
    @Size(max = 50)
    @Column(name = "user_id", length = 50)
    private String userId;

    /**
     * The EmployeesGroups isAdmin
     */
    @Column(name = "is_admin")
    private Boolean isAdmin;

    /**
     * The Employees languageId
     */
    @Column(name = "language_id")
    private Long languageId;

    /**
     * The Employees timezoneId
     */
    @Column(name = "timezone_id")
    private Long timezoneId;

    /**
     * The Employees formatDateId
     */
    @Column(name = "format_date_id")
    private Integer formatDateId;

    /**
     * The Employees employeeStatus
     */
    @Column(name = "employee_status")
    private Integer employeeStatus;

    /**
     * The flag display first screen
     */
    @Column(name = "is_display_first_screen")
    private Boolean isDisplayFirstScreen;

    /**
     * The Employees employeeData
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "employee_data", columnDefinition = "jsonb")
    private String employeeData;

    /**
     * The flag account quick sight
     */
    @Column(name = "is_account_quicksight")
    private Boolean isAccountQuicksight;

}
