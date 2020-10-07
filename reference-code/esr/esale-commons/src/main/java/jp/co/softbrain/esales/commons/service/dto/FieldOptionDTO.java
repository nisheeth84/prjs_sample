package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for API [getFieldOptionsItem]
 *
 * @author Trungnd
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldOptionDTO implements Serializable {

    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7347560129747138177L;

    /**
     * itemId
     */
    private Long itemId;
    
    /**
     * itemLabel
     */
    private String itemLabel;
}
