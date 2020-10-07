package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * request of saveNetWorkMap API
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class SaveNetWorkMapRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4511103483915466253L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * list of departments
     */
    private List<SaveNetWorkMapSubType1DTO> departments;

    /**
     * list of departmentIdsDelete
     */
    private List<Long> departmentIdsDelete;

    /**
     * list of businessCardsRemove
     */
    private List<Long> businessCardsRemove;

    /**
     * list of businessCards
     */
    private List<SaveNetWorkMapSubType3DTO> businessCards;
}
