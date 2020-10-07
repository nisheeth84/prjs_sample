package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for response of API updateBusinessCardsList.
 *
 * @author thanhdv
 */

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class BusinessCardListDetailIdDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3337405996476468939L;

    /**
     * businessCardListId
     */
    private Long businessCardListDetailId;
}
