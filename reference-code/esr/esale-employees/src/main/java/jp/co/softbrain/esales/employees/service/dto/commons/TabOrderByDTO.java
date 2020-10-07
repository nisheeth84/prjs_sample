package jp.co.softbrain.esales.employees.service.dto.commons;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
public class TabOrderByDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7902149484214875700L;

    /**
     * key
     */
    private String key;

    /**
     * fieldType
     */
    private Long fieldType;

    /**
     * value
     */
    private String value;

    /**
     * isNested
     */
    private Boolean isNested;

    /**
     * isDefault
     */
    private Boolean isDefault;
}
