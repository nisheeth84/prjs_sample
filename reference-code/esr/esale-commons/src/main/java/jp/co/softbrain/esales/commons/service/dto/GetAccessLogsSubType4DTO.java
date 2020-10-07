package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * GetAccessLogsSubType4DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class GetAccessLogsSubType4DTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4176072441397999172L;

    /**
     * The dateTime
     */
    private String dateTime;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The accountName
     */
    private String accountName;

    /**
     * The ipAddress
     */
    private String ipAddress;

    /**
     * The event
     */
    private String event;

    /**
     * The result
     */
    private String result;

    /**
     * The errorInformation
     */
    private String errorInformation;

    /**
     * The entityId
     */
    private Long entityId;

    /**
     * The additionalInformation
     */
    private String additionalInformation;
}
