package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO information of customer
 * 
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomersByIdsSubType1DTO implements Serializable {

    /**
     * @param customerId
     * @param customerName
     * @param parentCustomerName
     * @param zipCode
     * @param building
     * @param address
     */
    public GetCustomersByIdsSubType1DTO(Long customerId, String customerName, String parentCustomerName, String zipCode,
            String building, String address) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.parentCustomerName = parentCustomerName;
        this.zipCode = zipCode;
        this.building = building;
        this.address = address;
    }

    public GetCustomersByIdsSubType1DTO(Long customerId, String photoFileName, String photoFilePath,
            String customerName, String customerAliasName, Long parentCustomerId, String parentCustomerName,
            String phoneNumber, String zipCode, String building, String address, Integer businessMainId,
            Integer businessSubId, String url, String memo, String customerData, Long employeeId, Long departmentId,
            Long groupId, Long scenarioId, BigDecimal longitude, BigDecimal latitude, Instant createdDate,
            Long createdUser, Instant updatedDate, Long updatedUser, String parentTree) {
        this.customerId = customerId;
        this.photoFileName = photoFileName;
        this.photoFilePath = photoFilePath;
        this.customerName = customerName;
        this.customerAliasName = customerAliasName;
        this.parentCustomerId = parentCustomerId;
        this.parentCustomerName = parentCustomerName;
        this.phoneNumber = phoneNumber;
        this.zipCode = zipCode;
        this.building = building;
        this.address = address;
        this.businessMainId = businessMainId;
        this.businessSubId = businessSubId;
        this.url = url;
        this.memo = memo;
        this.customerData = customerData;
        this.employeeId = employeeId;
        this.departmentId = departmentId;
        this.groupId = groupId;
        this.scenarioId = scenarioId;
        this.longitude = longitude;
        this.latitude = latitude;
        this.createdDate = createdDate;
        this.createdUser = createdUser;
        this.updatedDate = updatedDate;
        this.updatedUser = updatedUser;
        this.parentTree = parentTree;
    }

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6742059474835537075L;
    /**
     * customerId
     */
    private Long customerId;

    /**
     * photoFileName
     */
    private String photoFileName;

    /**
     * photoFilePath
     */
    private String photoFilePath;

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
    private Long parentCustomerId;

    /**
     * parentName
     */
    private String parentCustomerName;

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
     * memo
     */
    private String memo;

    /**
     * customerData
     */
    private String customerData;

    /**
     * employee ID
     */
    private Long employeeId;

    /**
     * department ID
     */
    private Long departmentId;

    /**
     * group ID
     */
    private Long groupId;
    
    private Long scenarioId;
    
    private BigDecimal longitude;

    private BigDecimal latitude;

    private Instant createdDate;

    private Long createdUser;
    
    private Instant updatedDate;

    private Long updatedUser;

    private String parentTree;

    /**
     * parentCustomerBusinessId
     */
    private Long parentCustomerBusinessId;

    /**
     * parentCustomerBusinessName
     */
    private String parentCustomerBusinessName;

    /**
     * childCustomerBusinessId
     */
    private Long childCustomerBusinessId;

    /**
     * childCustomerBusinessName
     */
    private String childCustomerBusinessName;
}
