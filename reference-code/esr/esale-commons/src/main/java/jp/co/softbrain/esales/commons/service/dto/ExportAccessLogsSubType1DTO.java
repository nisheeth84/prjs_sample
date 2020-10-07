package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
public class ExportAccessLogsSubType1DTO implements Serializable {

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
