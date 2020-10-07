/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO Param for API updateList
 * 
 * @author phamminhphu
 *
 */
@Data
@EqualsAndHashCode
public class UpdateListInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1929411193890459227L;

    /**
     * customerListName
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
     * isOverWrite
     */
    private Boolean isOverWrite;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * listParticipants
     */
    private List<CustomersListSubType1DTO> listParticipants;

    /**
     * searchConditions
     */
    private List<CustomersListSubType2DTO> searchConditions;
}
