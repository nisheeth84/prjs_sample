package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the DeleteBusinessCardsMutation
 * {@link jp.co.softbrain.esales.businesscards.domain.BusinessCards} entity.
 * @author thanhdv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class DeleteBusinessCardsInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4396342598244590997L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * businessCardIds is a list of businessCardId
     */
    private List<Long> businessCardIds;

    /**
     * businessCardNames is a list of businessCardName not null
     */
    private List<String> businessCardNames = new ArrayList<>();
}
