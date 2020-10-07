package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class TemplateFieldInfoDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3801333772475834601L;

    private Long fieldId;

    private String fieldName;

    private String fieldLabel;

    private Integer modifyFlag;

    private Boolean isDefault;

    private Integer fieldType;
}
