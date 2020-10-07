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
 * BusinessCardReceivesType1DTO
 * @author buicongminh
 *
 */
@Data
@EqualsAndHashCode
public class BusinessCardReceivesType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3491992916865087653L;

    /**
     * employeeId
     */
    private Long employeeId;
    
    /**
     * employeeName
     */
    private String employeeName;

    /**
     * filePath
     */
    private String filePath;
}
