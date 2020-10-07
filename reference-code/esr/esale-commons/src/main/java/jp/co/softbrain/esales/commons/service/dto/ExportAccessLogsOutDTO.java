package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * DTO out of API ExportAccessLogs
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class ExportAccessLogsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3275433018554934733L;

    /**
     * accessLogDatas
     */
    private List<List<String>> accessLogDatas;

}
