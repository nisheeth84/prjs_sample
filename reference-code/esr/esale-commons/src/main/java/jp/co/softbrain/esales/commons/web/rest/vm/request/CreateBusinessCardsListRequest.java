package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;
import jp.co.softbrain.esales.commons.service.dto.BusinessCardsListDetailsSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.BusinessCardsListSearchConditionsSubTypeDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * request of CreateBusinessCardsList API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class CreateBusinessCardsListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1897336140539325027L;

    /**
     * businessCardList
     */
    private BusinessCardsListDetailsSubType1DTO businessCardList;

    /**
     * searchConditions
     */
    private List<BusinessCardsListSearchConditionsSubTypeDTO> searchConditions;

    /**
     * listOfBusinessCardId
     */
    private List<Long> listOfBusinessCardId;
}
