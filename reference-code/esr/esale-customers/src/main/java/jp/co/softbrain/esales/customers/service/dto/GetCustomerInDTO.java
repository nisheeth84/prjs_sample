package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerInDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetCustomerInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2843203009617700780L;

    /**
     * currentPage
     */
    private int currentPage;

    /**
     * limit
     */
    private int limit;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * calendarType
     */
    private int calendarType;

    /**
     * date
     */
    private String date;

    /**
     * mapType
     */
    private int mapType;

}
