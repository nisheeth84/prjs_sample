package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for DeleteBusinessCardsMutation
 * {@link jp.co.softbrain.esales.businesscards.domain.BusinessCards} entity.
 * @author thanhdv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class DeleteBusinessCardsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6436762872720541969L;

    /**
     * listOfBusinessCardId is a list of businessCardId
     */
    private List<Long> listOfBusinessCardId;

    /**
     * listOfCustomerId is a list of customerId deleted.
     */
    private List<Long> listOfCustomerId;

    /**
     * hasLastBusinessCard
     */
    private boolean hasLastBusinessCard;

    /**
     * messageWarning
     */
    private String messageWarning;
}
