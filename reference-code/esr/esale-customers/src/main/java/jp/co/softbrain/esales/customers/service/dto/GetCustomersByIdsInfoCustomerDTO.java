package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO output for API getCustomersByIds
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetCustomersByIdsInfoCustomerDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -770393992311802963L;

    private Long customerId;

    private CustomerPhotoDTO customerLogo;

    private String customerName;

    private String customerAliasName;

    private Long parentId;

    private CustomerParentsDTO customerParent;

    private String phoneNumber;

    private CustomerAddressDTO customerAddressObject;

    private String customerAddress;

    private CustomerLabelDTO businessMain;

    private CustomerLabelDTO businessSub;

    private String zipCode;

    private String building;

    private String address;

    private Integer businessMainId;

    private String businessMainName;

    private Integer businessSubId;

    private String businessSubName;

    private String url;

    private String memo;

    private Long employeeId;

    private Long departmentId;

    private Long groupId;

    private PersonsInChargeDTO personInCharge;

    private List<CustomerDataTypeDTO> customerData;

    private String customerDataString;

    private Instant updatedDate;

    private String photoFilePath;

    private String urlText;

    private String urlTarget;

    private String parentTree;

    private List<Long> parthTreeId;

    private List<String> pathTreeName;

    private String createdUserName;

    private String updatedUserName;

    private List<NextActionsDTO> nextActions;

    private List<NextSchedulesDTO> nextSchedules;

    private String photoFileName;

    private Long scenarioId;

    private BigDecimal longitude;

    private BigDecimal latitude;

    private Instant createdDate;

    private Long createdUserId;

    private String createdUserPhoto;

    private Long updatedUserId;

    private String updatedUserPhoto;

    private Long parentCustomerId;

    private String parentCustomerName;

    private String employeeName;

    private String employeePhoto;

}
