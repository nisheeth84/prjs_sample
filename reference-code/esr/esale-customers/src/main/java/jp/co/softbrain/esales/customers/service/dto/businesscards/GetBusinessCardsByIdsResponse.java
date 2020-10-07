package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * respoonse of GetBusinessCardsByIds API
 * 
 * @author datnm
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetBusinessCardsByIdsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3455182490325568974L;
    /**
     * 
     */
    private List<GetBusinessCardsByIdsDTO> businessCards;
}
