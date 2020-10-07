package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO input for API IntegrateCustomer
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class IntegrateCustomerInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7431632965111009418L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * photo
     */
    private String customerLogo;

    /**
     * customerName
     */
    private String customerName;

    /**
     * customerAliasName
     */
    private String customerAliasName;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * phoneNumber
     */
    private String phoneNumber;

    /**
     * zipCode
     */
    private String zipCode;

    /**
     * building
     */
    private String building;

    /**
     * address
     */
    private String address;

    /**
     * businessMainId
     */
    private Integer businessMainId;

    /**
     * businessSubId
     */
    private Integer businessSubId;

    /**
     * url
     */
    private String url;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * memo
     */
    private String memo;

    /**
     * customer data
     */
    private List<CustomerDataTypeDTO> customerData;

    /**
     * list id customer need delete
     */
    private List<Long> customerIdsDelete;

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
