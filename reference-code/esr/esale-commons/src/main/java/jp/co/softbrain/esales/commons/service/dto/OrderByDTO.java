package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
public class OrderByDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7755503159948089836L;

    /**
     * fieldName
     */
    private String key;

    /**
     * value
     */
    private String value;
}
