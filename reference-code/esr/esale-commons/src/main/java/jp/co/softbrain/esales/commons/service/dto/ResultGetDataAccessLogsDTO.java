package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Result Get Data Access Logs DTO
 *
 * @author QuangLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ResultGetDataAccessLogsDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -7191270943248787548L;

    /**
     * The accessLogId
     */
    private Long accessLogId;

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
