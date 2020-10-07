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
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

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

}
