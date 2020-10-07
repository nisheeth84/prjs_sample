/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.elasticsearch.dto.utils.BooleanDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 *
 * @author datnm
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetBusinessCardsByIdsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7212095705557621497L;

    /**
     * businessCardId
     */
    private Long businessCardId;

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
    private List<BusinessCardsDataTypeDTO> businessCardData;

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
