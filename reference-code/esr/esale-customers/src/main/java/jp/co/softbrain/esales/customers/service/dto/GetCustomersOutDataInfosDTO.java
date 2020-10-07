package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomersDataInfosDTO
 */
@Data
@EqualsAndHashCode
public class GetCustomersOutDataInfosDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3919394433960999964L;

    private Long customerId;

    private String customerName;

    private String photoFilePath;

    private CustomersLogoDTO customerLogo;

    private String phoneNumber;

    private CustomerAddressDTO customerAddressObject;

    private String customerAddress;

    private GetCustomersOutBusinessDTO business;

    private String url;

    private Long scenarioId;

    private BigDecimal longitude;

    private BigDecimal latitude;

    private GetCustomersOutParentTreeDTO customerParent;

    private Long parentId;

    private GetCustomersOutCustomerRelations directParent;

    private List<GetCustomersOutCustomerRelations> customerChildList;

    private String customerAliasName;

    private String memo;

    private List<CustomerDataTypeDTO> customerData;

    private Instant createdDate;

    private ModifyUserDTO createdUser;

    private Instant updatedDate;

    private ModifyUserDTO updatedUser;

    private PersonsInChargeDTO personInCharge;

    private String customerDataString;

    private String parentTree;

    private List<NextActionsDTO> nextActions;

    private List<NextSchedulesDTO> nextSchedules;

}
