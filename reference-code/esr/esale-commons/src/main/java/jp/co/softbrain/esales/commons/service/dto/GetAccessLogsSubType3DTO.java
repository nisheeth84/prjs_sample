package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * GetAccessLogsSubType3DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GetAccessLogsSubType3DTO extends BaseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -4165788994542932252L;

    /**
     * The accessLogId
     */
    private Long accessLogId;

    /**
     * The content
     */
    private GetAccessLogsSubType4DTO content;
}
