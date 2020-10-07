/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardAddressDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardListDetailIdDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardReceivesDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.DateDTO;
import jp.co.softbrain.esales.elasticsearch.dto.utils.BooleanDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -582449929144491393L;

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
     * businessCardAddress
     */
    private BusinessCardAddressDTO businessCardAddress;

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
    private DateDTO lastContactDate;

    /**
     * isWorking
     */
    private BooleanDTO isWorking;

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
     * businessCardData
     */
    private String businessCardData;

    /**
     * businessCardImagePath
     */
    private String businessCardImagePath;

    /**
     * businessCardImageName
     */
    private String businessCardImageName;

    /**
     * createdDate
     */
    private DateDTO createdDate;

    /**
     * updatedDate
     */
    private DateDTO updatedDate;

    /**
     * createdUser
     */
    private Long createdUser;

    /**
     * createdUserName
     */
    private String createdUserName;

    /**
     * updatedUser
     */
    private Long updatedUser;

    /**
     * updatedUserName
     */
    private String updatedUserName;

    /**
     * businessCardsList
     */
    private List<BusinessCardListDetailIdDTO> businessCardsList;

    /**
     * businessCardsReceives
     */
    private List<BusinessCardReceivesDTO> businessCardsReceives;

    /**
     * businessCardName
     */
    private String businessCardName;

    /**
     * businessCardNameKana
     */
    private String businessCardNameKana;

    /**
     * generalCustomerName
     */
    private String generalCustomerName;
}
