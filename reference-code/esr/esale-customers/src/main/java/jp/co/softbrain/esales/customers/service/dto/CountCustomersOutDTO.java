package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api countCustomersOut
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class CountCustomersOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -400595029938597571L;

    /**
     * count
     */
    private Long count;

}
