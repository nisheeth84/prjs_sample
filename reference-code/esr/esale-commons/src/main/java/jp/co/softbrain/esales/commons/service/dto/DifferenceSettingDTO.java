/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author chungochai
 *
 */
@Data
@EqualsAndHashCode
public class DifferenceSettingDTO implements Serializable{
    
    private static final long serialVersionUID = -5457312474771803061L;
    
    @JsonAlias("isDisplay")
    private Boolean isDisplay;
    
    @JsonAlias("backwardColor")
    private String backwardColor;
    
    @JsonAlias("backwardText")
    private String backwardText;
    
    @JsonAlias("forwardColor")
    private String forwardColor;
    
    
    @JsonAlias("forwardText")
    private String forwardText;
}
