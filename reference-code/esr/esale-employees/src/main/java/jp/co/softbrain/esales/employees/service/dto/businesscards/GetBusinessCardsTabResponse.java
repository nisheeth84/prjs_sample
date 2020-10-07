package jp.co.softbrain.esales.employees.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response of GetBusinessCardsTab API
 *
 * @author ANTSOFT
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetBusinessCardsTabResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2006010196717134563L;

    /**
     * businessCards
     */
    private List<BusinessCardSubType1DTO> businessCards;

    private Long totalRecords;
}
