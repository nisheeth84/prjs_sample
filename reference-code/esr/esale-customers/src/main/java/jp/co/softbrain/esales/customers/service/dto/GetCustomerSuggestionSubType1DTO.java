package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api getCustomerSuggestion
 *
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetCustomerSuggestionSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -400512329938597571L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    private String customerAliasName;
    private CustomerPhotoDTO customerLogo;
    private Instant createdDate;
    private Instant updatedDate;
    private String phoneNumber;
    private String url;
    private String customerAddress;
    private PersonsInChargeDTO personInCharge;
    private String memo;
    private List<CustomerDataTypeDTO> customerData;

    /**
     * idHistoryChoice
     */
    private Long idHistoryChoice;

}
