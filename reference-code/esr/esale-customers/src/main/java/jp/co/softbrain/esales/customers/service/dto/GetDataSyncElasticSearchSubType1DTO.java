package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetDataSyncElasticSearchSubType1DTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -1552889742154159956L;

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

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

    /**
     * The createdDate
     */
    private Instant createdDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The updatedUser
     */
    private Long updatedUser;

    /**
     * @param customerId
     * @param photoFileName
     * @param photoFilePath
     * @param customerName
     * @param customerAliasName
     * @param parentCustomerId
     * @param parentCustomerName
     * @param phoneNumber
     * @param zipCode
     * @param building
     * @param address
     * @param businessMainId
     * @param businessSubId
     * @param url
     * @param memo
     * @param customerData
     * @param employeeId
     * @param departmentId
     * @param groupId
     * @param parentCustomerBusinessId
     * @param parentCustomerBusinessName
     * @param childCustomerBusinessId
     * @param childCustomerBusinessName
     * @param createdDate
     * @param createdUser
     * @param updatedDate
     * @param updatedUser
     */
    public GetDataSyncElasticSearchSubType1DTO(Long customerId, String photoFileName, String photoFilePath,
            String customerName, String customerAliasName, Long parentCustomerId, String parentCustomerName,
            String phoneNumber, String zipCode, String building, String address, Integer businessMainId,
            Integer businessSubId, String url, String memo, String customerData, Long employeeId, Long departmentId,
            Long groupId, Long parentCustomerBusinessId, String parentCustomerBusinessName,
            Long childCustomerBusinessId, String childCustomerBusinessName, Instant createdDate, Long createdUser,
            Instant updatedDate, Long updatedUser) {
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
        this.parentCustomerBusinessId = parentCustomerBusinessId;
        this.parentCustomerBusinessName = parentCustomerBusinessName;
        this.childCustomerBusinessId = childCustomerBusinessId;
        this.childCustomerBusinessName = childCustomerBusinessName;
        this.createdDate = createdDate;
        this.createdUser = createdUser;
        this.updatedDate = updatedDate;
        this.updatedUser = updatedUser;
    }


}
