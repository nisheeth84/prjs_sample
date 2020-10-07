package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * data of node data.relationData of response from API getEmployeeLayout
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class DifferenceSettingDTO implements Serializable {

    private static final long serialVersionUID = -2011758438346812939L;

    private Boolean isDisplay;

    private String backwardColor;

    private String backwardText;

    private String forwardColor;

    private String forwardText;
}
