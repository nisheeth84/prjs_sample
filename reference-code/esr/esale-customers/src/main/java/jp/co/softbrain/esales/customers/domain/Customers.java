package jp.co.softbrain.esales.customers.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.hibernate.type.TextType;

import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersSupType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionResultSqlMappingDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType3DTO;
import jp.co.softbrain.esales.customers.service.dto.GetDataSyncElasticSearchSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetParentCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.InformationDetailsCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.SelectCustomersDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Customers entity
 *
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "customers")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "CustomersEntityMapping", entities = { @EntityResult(entityClass = Customers.class) })
@SqlResultSetMapping(name = "GetCustomerSuggestionResultSqlMapping", classes = {
        @ConstructorResult(targetClass = GetCustomerSuggestionResultSqlMappingDTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name"),
                @ColumnResult(name = "address"),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name"),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})
@SqlResultSetMapping(name = "InitializeNetworkMapCustomerDTOMapping", classes = {
        @ConstructorResult(targetClass = InitializeNetworkMapCustomerDTO.class,
                columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name", type = String.class),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name", type = String.class),
                @ColumnResult(name = "child_customer_id", type = Long.class),
                @ColumnResult(name = "child_customer_name", type = String.class)
        })
})
@SqlResultSetMapping(name = "SelectCustomersDTOMapping", classes = {
        @ConstructorResult(targetClass = SelectCustomersDTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name"),
                @ColumnResult(name = "photo_file_name"),
                @ColumnResult(name = "photo_file_path"),
                @ColumnResult(name = "customer_alias_name"),
                @ColumnResult(name = "phone_number"),
                @ColumnResult(name = "zip_code"),
                @ColumnResult(name = "building"),
                @ColumnResult(name = "address", type = String.class),
                @ColumnResult(name = "business_main_id", type = Integer.class),
                @ColumnResult(name = "business_main_name"),
                @ColumnResult(name = "business_sub_id", type = Integer.class),
                @ColumnResult(name = "business_sub_name"),
                @ColumnResult(name = "url", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "scenario_id", type = Long.class),
                @ColumnResult(name = "memo"),
                @ColumnResult(name = "longitude", type = BigDecimal.class),
                @ColumnResult(name = "latitude", type = BigDecimal.class),
                @ColumnResult(name = "customer_data", type = TextType.class),
                @ColumnResult(name = "parent_tree", type = TextType.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "created_user_name", type = String.class),
                @ColumnResult(name = "created_user_photo"),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class),
                @ColumnResult(name = "updated_user_name", type = String.class),
                @ColumnResult(name = "updated_user_photo"),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name"),
        })
})
@SqlResultSetMapping(name = "GetInformationOfCustomerMappingDTO", classes = {
        @ConstructorResult(targetClass = InformationDetailsCustomerDTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name"),
                @ColumnResult(name = "photo_file_name"),
                @ColumnResult(name = "photo_file_path"),
                @ColumnResult(name = "customer_alias_name"),
                @ColumnResult(name = "phone_number"),
                @ColumnResult(name = "zip_code"),
                @ColumnResult(name = "building"),
                @ColumnResult(name = "address"),
                @ColumnResult(name = "business_main_id", type = Integer.class),
                @ColumnResult(name = "business_main_name"),
                @ColumnResult(name = "business_sub_id", type = Integer.class),
                @ColumnResult(name = "business_sub_name"),
                @ColumnResult(name = "url", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "scenario_id", type = Long.class),
                @ColumnResult(name = "memo"),
                @ColumnResult(name = "longitude", type = BigDecimal.class),
                @ColumnResult(name = "latitude", type = BigDecimal.class),
                @ColumnResult(name = "customer_data", type = TextType.class),
                @ColumnResult(name = "parent_tree", type = TextType.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "created_user_name", type = String.class),
                @ColumnResult(name = "created_user_photo"),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class),
                @ColumnResult(name = "updated_user_name", type = String.class),
                @ColumnResult(name = "updated_user_photo"),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name"),
                @ColumnResult(name = "emp_incharge_name"),
                @ColumnResult(name = "emp_incharge_photo"),
                @ColumnResult(name = "url_text"),
                @ColumnResult(name = "url_target")
        }) })
@SqlResultSetMapping(name = "GetChildCustomersOutMapping", classes = {
        @ConstructorResult(targetClass = GetChildCustomersSupType1DTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name", type = String.class),
                @ColumnResult(name = "level", type = Integer.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
@SqlResultSetMapping(name = "GetInfoCustomersDTOMapping", classes = {
        @ConstructorResult(targetClass = GetCustomersTabSubType3DTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name", type = String.class),
                @ColumnResult(name = "phone_number", type = String.class),
                @ColumnResult(name = "building", type = String.class),
                @ColumnResult(name = "address", type = String.class),
                @ColumnResult(name = "business_main_name", type = String.class),
                @ColumnResult(name = "business_sub_name", type = String.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
@SqlResultSetMapping(name = "GetDataSyncElasticSearchMapping", classes = {
        @ConstructorResult(targetClass = GetDataSyncElasticSearchSubType1DTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "photo_file_name", type = String.class),
                @ColumnResult(name = "photo_file_path", type = String.class),
                @ColumnResult(name = "customer_name", type = String.class),
                @ColumnResult(name = "customer_alias_name", type = String.class),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name", type = String.class),
                @ColumnResult(name = "phone_number", type = String.class),
                @ColumnResult(name = "zip_code", type = String.class),
                @ColumnResult(name = "building", type = String.class),
                @ColumnResult(name = "address", type = String.class),
                @ColumnResult(name = "business_main_id", type = Integer.class),
                @ColumnResult(name = "business_sub_id", type = Integer.class),
                @ColumnResult(name = "url", type = String.class),
                @ColumnResult(name = "memo", type = String.class),
                @ColumnResult(name = "customer_data", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "parent_customer_business_id", type = Long.class),
                @ColumnResult(name = "parent_customer_business_name", type = String.class),
                @ColumnResult(name = "child_customer_business_id", type = Long.class),
                @ColumnResult(name = "child_customer_business_name", type = String.class),
                @ColumnResult(name = "customer_list_id", type = Long.class),
                @ColumnResult(name = "customer_list_name", type = String.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class)
        })
})
@SqlResultSetMapping(name = "GetCustomersByIdsMapping", classes = {
        @ConstructorResult(targetClass = GetCustomersByIdsSubType1DTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "photo_file_name", type = String.class),
                @ColumnResult(name = "photo_file_path", type = String.class),
                @ColumnResult(name = "customer_name", type = String.class),
                @ColumnResult(name = "customer_alias_name", type = String.class),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name", type = String.class),
                @ColumnResult(name = "phone_number", type = String.class),
                @ColumnResult(name = "zip_code", type = String.class),
                @ColumnResult(name = "building", type = String.class),
                @ColumnResult(name = "address", type = String.class),
                @ColumnResult(name = "business_main_id", type = Integer.class),
                @ColumnResult(name = "business_sub_id", type = Integer.class),
                @ColumnResult(name = "url", type = String.class),
                @ColumnResult(name = "memo", type = String.class),
                @ColumnResult(name = "customer_data", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "parent_customer_business_id", type = Long.class),
                @ColumnResult(name = "parent_customer_business_name", type = String.class),
                @ColumnResult(name = "child_customer_business_id", type = Long.class),
                @ColumnResult(name = "child_customer_business_name", type = String.class)
        })
})
@SqlResultSetMapping(name = "GetCustomersSuggestionByIdsMapping", classes = {
        @ConstructorResult(targetClass = GetCustomersByIdsSubType1DTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "photo_file_name", type = String.class),
                @ColumnResult(name = "photo_file_path", type = String.class),
                @ColumnResult(name = "customer_name", type = String.class),
                @ColumnResult(name = "customer_alias_name", type = String.class),
                @ColumnResult(name = "parent_customer_id", type = Long.class),
                @ColumnResult(name = "parent_customer_name", type = String.class),
                @ColumnResult(name = "phone_number", type = String.class),
                @ColumnResult(name = "zip_code", type = String.class),
                @ColumnResult(name = "building", type = String.class),
                @ColumnResult(name = "address", type = String.class),
                @ColumnResult(name = "business_main_id", type = Integer.class),
                @ColumnResult(name = "business_sub_id", type = Integer.class),
                @ColumnResult(name = "url", type = TextType.class),
                @ColumnResult(name = "memo", type = String.class),
                @ColumnResult(name = "customer_data", type = TextType.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "group_id", type = Long.class),
                @ColumnResult(name = "scenario_id", type = Long.class),
                @ColumnResult(name = "longitude", type = BigDecimal.class),
                @ColumnResult(name = "latitude", type = BigDecimal.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class),
                @ColumnResult(name = "parent_tree", type = TextType.class)
            })
})
@SqlResultSetMapping(name = "GetParentCustomersDTOMapping", classes = {
        @ConstructorResult(targetClass = GetParentCustomersDTO.class, columns = {
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "pathTreeName", type = String.class),
                @ColumnResult(name = "pathTreeId", type = List.class) }) })

@SqlResultSetMapping(name = "CalculatorFormularDTOMapping", classes = {
        @ConstructorResult(targetClass = CalculatorFormularDTO.class, columns = {
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
public class Customers extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 3288074141089182673L;

    /**
     * customerId
     */
    @Id
    @NotNull
    @Column(name = "customer_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_sequence_generator")
    @SequenceGenerator(name = "customers_sequence_generator", allocationSize = 1)
    private Long customerId;

    /**
     * photoFileName
     */
    @Size(max = 255)
    @Column(name = "photo_file_name", length = 255)
    private String photoFileName;

    /**
     * photoFilePath
     */
    @Size(max = 255)
    @Column(name = "photo_file_path", length = 255)
    private String photoFilePath;

    /**
     * parentId
     */
    @Column(name = "parent_id")
    private Long parentId;

    /**
     * customerName
     */
    @Size(max = 100)
    @Column(name = "customer_name", length = 100)
    private String customerName;

    /**
     * customerAliasName
     */
    @Size(max = 100)
    @Column(name = "customer_alias_name", length = 100)
    private String customerAliasName;

    /**
     * phoneNumber
     */
    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    /**
     * zipCode
     */
    @Size(max = 16)
    @Column(name = "zip_code", length = 16)
    private String zipCode;

    /**
     * building
     */
    @Size(max = 255)
    @Column(name = "building", length = 255)
    private String building;

    /**
     * address
     */
    @Size(max = 255)
    @Column(name = "address", length = 255)
    private String address;

    /**
     * businessMainId
     */
    @Column(name = "business_main_id")
    private Integer businessMainId;

    /**
     * businessSubId
     */
    @Column(name = "business_sub_id")
    private Integer businessSubId;

    /**
     * url
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "url", columnDefinition = "jsonb")
    private String url;

    /**
     * employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * departmentId
     */
    @Column(name = "department_id")
    private Long departmentId;

    /**
     * groupId
     */
    @Column(name = "group_id")
    private Long groupId;

    /**
     * scenarioId
     */
    @Column(name = "scenario_id")
    private Long scenarioId;

    /**
     * memo
     */
    @Column(name = "memo", columnDefinition = "text")
    private String memo;

    /**
     * longitude
     */
    @Digits(integer = 13, fraction = 0)
    @Column(name = "longitude", columnDefinition = "decimal(13,0)")
    private BigDecimal longitude;

    /**
     * latitude
     */
    @Digits(integer = 13, fraction = 0)
    @Column(name = "latitude", columnDefinition = "decimal(13,0)")
    private BigDecimal latitude;

    /**
     * customerData
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "customer_data", columnDefinition = "jsonb")
    private String customerData;

    /**
     * parentTree
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "parent_tree", columnDefinition = "jsonb")
    private String parentTree;
}
