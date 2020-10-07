package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
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
public class GetCustomerSuggestionOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -400512329912397571L;

    /**
     * customers
     */
    private List<GetCustomerSuggestionSubType1DTO> customers;

}
