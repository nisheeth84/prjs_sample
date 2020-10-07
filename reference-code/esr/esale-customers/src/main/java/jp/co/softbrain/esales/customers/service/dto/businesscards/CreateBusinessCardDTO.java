package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateBusinessCardDTO for CreateBusinessCard
 *
 * @author quangnd
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateBusinessCardDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2003239829695943751L;

    /**
     * businessCardImageData
     */
    private String businessCardImageData;

    /**
     * businessCardImagePath
     */
    private String businessCardImagePath;

    /**
     * businessCardImageName
     */
    private String businessCardImageName;

    /**
     * customerId
     */
    private Long customerId;
    /**
     * customerId
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
     * address
     */
    private String address;

    /**
     * building
     */
    private String building;

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
     * receivePerson
     */
    private List<ReceivePersonDTO> receivePerson;

    /**
     * isWorking
     */
    private Boolean isWorking;

    /**
     * fax
     */
    private String fax;

    /**
     * isHandMode
     */
    private Boolean isHandMode;

    /**
     * url
     */
    private String url;

    /**
     * memo
     */
    private String memo;

    /**
     * businessCardData
     */
    private List<BusinessCardsDataTypeDTO> businessCardData;

    /**
     * saveMode
     */
    private Long saveMode;

    /**
     * isDigitalize
     */
    private Boolean isDigitalize;

}
