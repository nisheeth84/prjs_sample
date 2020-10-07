package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO is a element for the create businessCards List.
 *
 * @author thanhdv
 * @link jp.co.softbrain.esales.businesscards.domain.BusinessCardsList entity.
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class BusinessCardsListDetailsSubType1DTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3889694277079674122L;

    /**
     * businessCardListName
     */
    private String businessCardListName;

    /**
     * listType
     */
    private Integer listType;

    /**
     * listMode
     */
    private Integer listMode;

    /**
     * ownerList is List of share list owners
     */
    private List<String> ownerList;

    /**
     * viewerList is List of people who are allowed to view shared lists in case
     * of
     * creating shared lists
     */
    private List<String> viewerList;

    /**
     * isOverWrite
     */
    private Integer isOverWrite;

}
