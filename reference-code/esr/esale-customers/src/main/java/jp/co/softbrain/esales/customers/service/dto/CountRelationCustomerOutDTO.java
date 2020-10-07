package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api countRelationCustomer
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class CountRelationCustomerOutDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -400590025938597571L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * countBusinessCard
     */
    private Long countBusinessCard;

    /**
     * countActivities
     */
    private Long countActivities;

    /**
     * countSchedules
     */
    private Long countSchedules;

    /**
     * countTasks
     */
    private Long countTasks;

    /**
     * countTimelines
     */
    private Long countTimelines;

    /**
     * countEmail
     */
    private Long countEmail;

    /**
     * countProductTrading
     */
    private Long countProductTrading;

}
