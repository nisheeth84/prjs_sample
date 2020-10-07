package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SpecialItemsOutDTO
 *
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class SpecialItemDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7031248950093297726L;
    /**
     * fieldName
     */
    private String fieldName;
    /**
     * fieldItems
     */
    private List<FieldItemDTO> fieldItems;

}
