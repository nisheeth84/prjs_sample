/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.businesscards.SaveNetWorkMapSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.SaveNetWorkMapSubType3DTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Save network map request
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveNetworkMapRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5991386991734926277L;

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
