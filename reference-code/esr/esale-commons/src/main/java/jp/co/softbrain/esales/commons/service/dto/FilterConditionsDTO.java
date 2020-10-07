package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class FilterConditionsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3851996236722522417L;

    /**
     * fieldType
     */
    private String fieldType;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * filterType
     */
    private String filterType;

    /**
     * filterOption
     */
    private String filterOption;

    /**
     * fieldValue
     */
    private String fieldValue;
}
