package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Input class DTO customers
 */
@Data
@EqualsAndHashCode
public class CustomersInputDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4525029516583016101L;

    /**
     * customerLogo
     */
    private String customerLogo;

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
     * totalTradingAmount
     */
    private Long totalTradingAmount;

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
    private List<CustomerDataTypeDTO> customerData;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * scenarioId
     */
    private Long scenarioId;

    /**
     * personInCharge
     */
    private PersonInChargeDTO personInCharge;
}
