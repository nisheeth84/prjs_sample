package jp.co.softbrain.esales.customers.service.dto.businesscards;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * GetBusinessCardsByIdsRequest
 * ngant
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetBusinessCardsByIdsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1897336140539625027L;

    /**
     * businessCardIds
     */
    private List<Long> businessCardIds;
}
