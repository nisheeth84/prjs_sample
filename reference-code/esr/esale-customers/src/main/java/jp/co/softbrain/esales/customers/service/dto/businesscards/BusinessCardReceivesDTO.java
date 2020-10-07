/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 *
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class BusinessCardReceivesDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * employeeId
     */
    private Long employeeId;
    
    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeSurname
     */
    private String employeeSurname;
    
    /**
     * filePath
     */
    private String filePath;
    
    /**
     * receiveDate
     */
    private DateDTO receiveDate;
    
    /**
     * lastContactDateReceiver
     */
    private DateDTO lastContactDateReceiver;
}
