package jp.co.softbrain.esales.customers.domain;

import java.io.Serializable;
import java.time.Instant;

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
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersListInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersSubType4DTO;
import jp.co.softbrain.esales.customers.service.dto.GetInformationOfListDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMyListDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The customer_list entity
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "customers_list")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetMyListDTOMapping", classes = {
        @ConstructorResult(targetClass = GetMyListDTO.class, columns = {
                @ColumnResult(name = "customer_list_id", type = Long.class),
                @ColumnResult(name = "customer_list_name", type = String.class),
                @ColumnResult(name = "is_auto_list", type = Boolean.class), }) })
@SqlResultSetMapping(name = "CustomersListOptionalsMapping", classes = {
        @ConstructorResult(targetClass =CustomersListOptionalsDTO.class, columns = {
                @ColumnResult(name = "customer_list_id", type = Long.class),
                @ColumnResult(name = "customer_list_name", type = String.class),
                @ColumnResult(name = "is_auto_list", type = Boolean.class),
                @ColumnResult(name = "customer_list_type", type = Integer.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "participant_type", type = Integer.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "last_updated_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_user", type = Long.class)
        }) })
@SqlResultSetMapping(name = "GetInformationOfListDTOMapping", classes = {
        @ConstructorResult(targetClass = GetInformationOfListDTO.class, columns = {
                @ColumnResult(name = "is_auto_list", type = Boolean.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "customer_list_search_condition_id", type = Long.class),
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "search_type", type = Integer.class),
                @ColumnResult(name = "search_option", type = Integer.class),
                @ColumnResult(name = "search_value", type = String.class),
                @ColumnResult(name = "time_zone_offset", type = Integer.class)
        }) })
@SqlResultSetMapping(name = "GetFavoriteCustomersOutMapping", classes = {
        @ConstructorResult(targetClass = GetFavoriteCustomersListInfoDTO.class, columns = {
                @ColumnResult(name = "customer_list_id", type = Long.class),
                @ColumnResult(name = "customer_list_name", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
@SqlResultSetMapping(name = "GetFavoriteCustomersSubType4Mapping", classes = {
        @ConstructorResult(targetClass = GetFavoriteCustomersSubType4DTO.class, columns = {
                @ColumnResult(name = "customer_list_favourite_id", type = Long.class),
                @ColumnResult(name = "customer_list_id", type = Long.class),
                @ColumnResult(name = "customer_list_name", type = String.class),
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "customer_name", type = String.class) }) })
@SqlResultSetMapping(name = "GetCustomerListFavoriteByEmployeeIdMapping", classes = {
        @ConstructorResult(targetClass = CustomersListOptionalsDTO.class, columns = {
                @ColumnResult(name = "customer_list_id", type = Long.class),
                @ColumnResult(name = "customer_list_name", type = String.class),
                @ColumnResult(name = "is_auto_list", type = Boolean.class),
                @ColumnResult(name = "customer_list_type", type = Integer.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "participant_type", type = Integer.class),
                @ColumnResult(name = "is_over_write", type = Boolean.class),
                @ColumnResult(name = "last_updated_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_user", type = Long.class) }) })
public class CustomersList extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -1783321406618637645L;

    /**
     * customerListId
     */
    @Id
    @NotNull
    @Column(name = "customer_list_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_list_sequence_generator")
    @SequenceGenerator(name = "customers_list_sequence_generator", allocationSize = 1)
    private Long customerListId;

    /**
     * customerListName
     */
    @NotNull
    @Size(max = 50)
    @Column(name = "customer_list_name", length = 50)
    private String customerListName;

    /**
     * customerListType
     */
    @Column(name = "customer_list_type")
    private Integer customerListType;

    /**
     * isAutoList
     */
    @Column(name = "is_auto_list")
    private Boolean isAutoList;

    /**
     * updatedInprogress
     */
    @Column(name = "updated_inprogress")
    private Boolean updatedInprogress;

    /**
     * lastUpdatedDate
     */
    @Column(name = "last_updated_date")
    private Instant lastUpdatedDate;

    /**
     * isOverWrite
     */
    @Column(name = "is_over_write")
    private Boolean isOverWrite;

}
