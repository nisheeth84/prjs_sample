package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CustomersListOptionalsDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CustomersListOptionalsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2916124624686530586L;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

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

    /**
     * lastUpdatedDate
     */
    private Instant lastUpdatedDate;

    /**
     * createdUser
     */
    private Long createdUser;

    /**
     * updatedUser
     */
    private Long updatedUser;

    /**
     * @param customerListId
     * @param customerListName
     * @param isAutoList
     * @param customerListType
     * @param updatedDate
     */
    public CustomersListOptionalsDTO(Long customerListId, String customerListName, Boolean isAutoList,
            Integer customerListType, Instant updatedDate) {
        this.customerListId = customerListId;
        this.customerListName = customerListName;
        this.isAutoList = isAutoList;
        this.customerListType = customerListType;
        this.updatedDate = updatedDate;
    }

}
