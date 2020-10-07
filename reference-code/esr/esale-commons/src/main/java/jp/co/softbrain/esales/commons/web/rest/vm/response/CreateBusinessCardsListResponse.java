package jp.co.softbrain.esales.commons.web.rest.vm.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * response of createBusinessCardsList API
 * 
 * @author ANTSOFTs
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateBusinessCardsListResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3517406726476477539L;

    /**
     * businessCardListId
     */
    private Long businessCardListDetailId;
}
