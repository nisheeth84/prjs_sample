/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardReceivesType1DTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType13DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7675975007462801873L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * companyName
     */
    private String customerName;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * position
     */
    private String position;

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
     * phoneNumber
     */
    private String phoneNumber;

    /**
     * mobileNumber
     */
    private String mobileNumber;

    /**
     * emailAddress
     */
    private String emailAddress;

    /**
     * lastContactDate
     */
    private String lastContactDate;

    /**
     * receiveDate
     */
    private String receiveDate;

    /**
     * isWorking
     */
    private Boolean isWorking;

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
    private List<BusinessCardReceivesType1DTO> businessCardReceives;

}
