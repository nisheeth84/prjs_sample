/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 *
 * @author datnm
 */
@Data
@EqualsAndHashCode
public class BusinessCardAddressDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;
    
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
     * fullAddress
     */
    private String fullAddress;
}
