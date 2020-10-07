package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * response of saveNetWorkMap API
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class SaveNetWorkMapResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1113103483915466253L;

    /**
     * list of businessCards response
     */
    private List<SaveNetWorkMapSubType4DTO> businessCards;

}
