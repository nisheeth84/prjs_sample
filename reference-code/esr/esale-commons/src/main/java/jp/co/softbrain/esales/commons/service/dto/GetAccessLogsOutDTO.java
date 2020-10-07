package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * GetAccessLogsOutDTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class GetAccessLogsOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4827866947429895262L;

    /**
     * The accessLogs
     */
    private List<GetAccessLogsSubType3DTO> accessLogs;

    /**
     * The totalCount
     */
    private Long totalCount;

    /**
     * The initializeInfo
     */
    private GetInitializeListInfoOutDTO initializeInfo;

}
