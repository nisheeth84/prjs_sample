package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.DynamicDataDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Customer info for API getDataSyncElasticSearch
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class CustomerInfoDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 7321898081880856025L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerLogo
     */
    private CustomerPhotoDTO customerLogo;

    /**
     * customerName
     */
    private String customerName;

    /**
     * customerAliasName
     */
    private String customerAliasName;

    /**
     * customerParent
     */
    private CustomerParentsDTO customerParent;

    /**
     * phoneNumber
     */
    private String phoneNumber;

    /**
     * customerAddress
     */
    private CustomerAddressDTO customerAddress;

    /**
     * businessMain
     */
    private CustomerLabelDTO businessMain;

    /**
     * businessSub
     */
    private CustomerLabelDTO businessSub;

    /**
     * url
     */
    private String url;

    /**
     * memo
     */
    private String memo;

    /**
     * personInCharge
     */
    private PersonInChargeDTO personInCharge;

    /**
     * customerData
     */
    private List<DynamicDataDTO> customerData;

    /**
     * customerList
     */
    private List<CustomerLabelDTO> customerList;

    /**
     * The createdDate
     */
    private DateFormatDTO createdDate;

    /**
     * The updatedDate
     */
    private DateFormatDTO updatedDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedUser
     */
    private Long updatedUser;

    /**
     * The createdUserName
     */
    private String createdUserName;

    /**
     * The updatedUserName
     */
    private String updatedUserName;

}
