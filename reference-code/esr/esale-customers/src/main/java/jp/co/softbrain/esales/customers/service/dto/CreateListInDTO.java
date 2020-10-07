/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO Param for API createList
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class CreateListInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8303223282911127314L;

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
     * listMembers
     */
    private List<Long> listMembers;

    /**
     * listParticipants
     */
    private List<CustomersListSubType1DTO> listParticipants;

    /**
     * searchConditions
     */
    private List<CustomersListSubType2DTO> searchConditions;
}
