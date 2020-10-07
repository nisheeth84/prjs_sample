package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import jp.co.softbrain.esales.customers.domain.CustomersList;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for the entity {@link CustomersList}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 7863503536283913551L;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

    /**
     * customerListType
     */
    private Integer customerListType;

    /**
     * isAutoList
     */
    private Boolean isAutoList;

    /**
     * updatedInprogress
     */
    private Boolean updatedInprogress;

    /**
     * lastUpdatedDate
     */
    private Instant lastUpdatedDate;

    /**
     * isOverWrite
     */
    private Boolean isOverWrite;

}
