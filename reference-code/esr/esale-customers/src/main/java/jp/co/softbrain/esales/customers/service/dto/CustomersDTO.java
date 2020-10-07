package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import jp.co.softbrain.esales.customers.domain.Customers;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for the entity {@link Customers}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -2704902524287867707L;

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
     * parentId
     */
    private Long parentId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * customerAliasName
     */
    private String customerAliasName;

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
     * longitude
     */
    private BigDecimal longitude;

    /**
     * latitude
     */
    private BigDecimal latitude;

    /**
     * customerData
     */
    private String customerData;

    /**
     * scenarioId
     */
    private Long scenarioId;

    /**
     * parentTree
     */
    private String parentTree;

}
