package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api getCustomersTab
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetCustomersTabOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -724567735438597571L;

    /**
     * data
     */
    private GetCustomersTabSubType2DTO data;

}
