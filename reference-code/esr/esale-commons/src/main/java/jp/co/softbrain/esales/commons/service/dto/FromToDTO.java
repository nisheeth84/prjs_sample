package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * From To DTO
 * 
 * @author DatDV
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class FromToDTO implements Serializable{
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3332237229604800431L;

    /**
     * from
     */
    private String from;
    
    /**
     * to
     */
    private Integer to;
}
