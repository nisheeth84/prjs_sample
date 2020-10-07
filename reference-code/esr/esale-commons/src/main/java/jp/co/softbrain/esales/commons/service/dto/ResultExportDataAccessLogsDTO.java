package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Result Get Data Access Logs DTO
 *
 * @author DatDV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ResultExportDataAccessLogsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7191270943248787548L;

    /**
     * dateTime
     */
    private String event;

    /**
     * accountName
     */
    private String ipAddress;

    /**
     * ipAddress
     */
    private String dateTime;

    /**
     * event
     */
    private String entityId;

    /**
     * entityId
     */
    private String result;

    /**
     * result
     */
    private String additionalInformation;

    /**
     * errorInformation
     */
    private String errorInformation;

    /**
     * acountName
     */
    private String accountName;

}
