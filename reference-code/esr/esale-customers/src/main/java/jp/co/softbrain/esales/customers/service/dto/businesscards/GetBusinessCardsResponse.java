package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response of GetBusinessCards API
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetBusinessCardsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3560155314111139774L;

    /**
     * list business cards
     */
    private List<BusinessCardSubType1DTO> businessCards;

    /**
     * total records
     */
    private Long totalRecords;

    /**
     * initializeInfo
     */
    private GetInitializeListInfoSubType1DTO initializeInfo;

    /**
     * field info
     */
    private List<FieldInfoPersonalsOutDTO> fieldInfo;

    /**
     * lastUpdateDate
     */
    private Instant lastUpdateDate;

}
