package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerListSubType1DTO
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetCustomerListSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2816124624686530586L;

    /**
     * customerListId
     */
    private Long listId;

    /**
     * customerListName
     */
    private String listName;

    /**
     * isAutoList
     */
    private Boolean isAutoList;

    /**
     * customerListType
     */
    private Integer customerListType;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * participantType
     */
    private Integer participantType;

    /**
     * isOverWrite
     */
    private Boolean isOverWrite;
}
