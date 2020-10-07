package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateProductTradingsListSubType2DTO of api createProductTradingsList
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductTradingsListSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1323651312782661230L;

    private Long fieldId;

    private Integer searchType;

    private Integer searchOption;

    private String searchValue;
}
