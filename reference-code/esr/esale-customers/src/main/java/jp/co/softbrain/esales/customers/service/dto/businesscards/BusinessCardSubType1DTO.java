package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The BusinessCardSubType1DTO class to map data for Business Card Response from
 * getBusinessCards API
 *
 * @author trungbh
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class BusinessCardSubType1DTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -3691599864556030982L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * alternativeCustomerName
     */
    private String alternativeCustomerName;

    /**
     * firstName
     */
    private String firstName;

    /**
     * lastName
     */
    private String lastName;

    /**
     * firstNameKana
     */
    private String firstNameKana;

    /**
     * lastNameKana
     */
    private String lastNameKana;

    /**
     * position
     */
    private String position;

    /**
     * departmentName
     */
    private String departmentName;

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
     * emailAddress
     */
    private String emailAddress;

    /**
     * phoneNumber
     */
    private String phoneNumber;

    /**
     * mobileNumber
     */
    private String mobileNumber;

    /**
     * lastContactDate
     */
    private Instant lastContactDate;

    private Long activityId;

    /**
     * isWorking
     */
    private Boolean isWorking;

    /**
     * memo
     */
    private String memo;

    /**
     * isDigitalize
     */
    private Boolean isDigitalize;

    /**
     * isHandMode
     */
    private Boolean isHandMode;

    /**
     * fax
     */
    private String fax;

    /**
     * url
     */
    private String url;

    /**
     * saveMode
     */
    private Integer saveMode;
    /**
     * isAutoGeneratedImage
     */
    private Boolean isAutoGeneratedImage;

    /**
     * businessCardData
     */
    private List<BusinessCardsDataTypeDTO> businessCardData = new ArrayList<>();

    /**
     * businessCardImagePath
     */
    private String businessCardImagePath;

    /**
     * businessCardImageName
     */
    private String businessCardImageName;

    /**
     * businessCardsReceives
     */
    private List<BusinessCardReceiveSubTypeDTO> businessCardsReceives = new ArrayList<>();

    /**
     * createdUser
     */
    private EmployeeOutDTO createdUserInfo = new EmployeeOutDTO();

    /**
     * updatedUser
     */
    private EmployeeOutDTO updatedUserInfo = new EmployeeOutDTO();
}
