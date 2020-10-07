package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO sub type for API deleteEmployee
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class DeleteEmployeeOutSubType2 implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 6423480837139785186L;

    /**
     * countSchedules
     */
    private int countSchedules;

    /**
     * countCustomers
     */
    private int countCustomers;

    /**
     * countTodos
     */
    private int countTodos;

    /**
     * countActivities
     */
    private int countActivities;

    /**
     * countSaleProducts
     */
    private int countSaleProducts;

    /**
     * countNameCards
     */
    private int countNameCards;

    /**
     * countAnalysisReports
     */
    private int countAnalysisReports;

    /**
     * countOcrNameCards
     */
    private int countOcrNameCards;

    /**
     * countOcrNameCards
     */
    private int countEmployees;

    /**
     * countOcrNameCards
     */
    private int countDepartments;

    /**
     * countOcrNameCards
     */
    private int countGroups;

}
