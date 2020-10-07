package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutSubType4DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetCustomerOutDetailsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6928797891723769779L;

    private Long customerId;

    private String photoFilePath;

    private CustomersLogoDTO customerLogo;

    private Long parentId;

    private String parentName;

    private String customerName;

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

    private String memo;

    private Long scenarioId;

    private BigDecimal longitude;

    private BigDecimal latitude;

    private String parentTree;

    private Instant createdDate;

    private ModifyUserDTO createdUser;

    private Instant updatedDate;

    private ModifyUserDTO updatedUser;

    private List<CustomerDataTypeDTO> customerData;

    private PersonsInChargeDTO personInCharge;

    private List<NextSchedulesDTO> nextSchedules;

    private List<NextActionsDTO> nextActions;

    private String customerDataString;

    private GetCustomersOutParentTreeDTO customerParent;

}
