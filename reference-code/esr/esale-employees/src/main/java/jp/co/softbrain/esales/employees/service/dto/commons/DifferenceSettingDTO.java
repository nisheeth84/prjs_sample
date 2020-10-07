package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class DifferenceSettingDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6395241601322009876L;

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
