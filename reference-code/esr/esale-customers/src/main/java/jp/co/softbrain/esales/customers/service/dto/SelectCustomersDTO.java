package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * SelectCustomersDTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class SelectCustomersDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 740449224997850209L;


    private Long customerId;

    private String customerName;

    private String photoFileName;

    private String photoFilePath;

    private String customerAliasName;

    private String phoneNumber;

    private String zipCode;

    private String building;

    private String address;

    private Integer businessMainId;

    private String businessMainName;

    private Integer businessSubId;

    private String businessSubName;

    private String url;

    private Long employeeId;

    private Long departmentId;

    private Long groupId;

    private Long scenarioId;

    private String memo;

    private BigDecimal longitude;

    private BigDecimal latitude;

    private String customerData;

    private String parentTree;

    private Instant createdDate;

    private Long createdUserId;

    private String createdUserName;

    private String createdUserPhoto;

    private Instant updatedDate;

    private Long updatedUserId;

    private String updatedUserName;

    private String updatedUserPhoto;

    private Long parentCustomerId;

    private String parentCustomerName;

}
