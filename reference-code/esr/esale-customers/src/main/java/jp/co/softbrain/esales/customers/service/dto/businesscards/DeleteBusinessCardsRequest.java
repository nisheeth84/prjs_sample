package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * request of DeleteBusinessCards API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class DeleteBusinessCardsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4169465836998491914L;

    /**
     * businessCards
     */
    private List<DeleteBusinessCardsInDTO> businessCards;

    /**
     * processMode
     */
    private Integer processMode;

}
