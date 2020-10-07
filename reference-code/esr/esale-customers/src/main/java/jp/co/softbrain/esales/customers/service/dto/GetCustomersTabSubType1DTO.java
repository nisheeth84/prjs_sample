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
public class GetCustomersTabSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -400595026212345671L;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * fieldValue
     */
    private String fieldValue;

}
