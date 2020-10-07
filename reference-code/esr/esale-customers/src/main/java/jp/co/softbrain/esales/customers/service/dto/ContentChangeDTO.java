package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 *ContentChangeDTO
 *
 * @author lequyphuc
 *
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class ContentChangeDTO implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1634634634634L;
    
    /**
     * fieldName
     */
    private String fieldName;
    
    /**
     * oldValue
     */
    private String oldValue;
    
    /**
     * newValue
     */
    private String newValue;

}
