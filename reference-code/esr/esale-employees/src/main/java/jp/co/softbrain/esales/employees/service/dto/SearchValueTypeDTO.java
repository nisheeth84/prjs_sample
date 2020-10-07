package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The KeyValue class to map data for SearchConditions
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SearchValueTypeDTO extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1686557382241077660L;
}
