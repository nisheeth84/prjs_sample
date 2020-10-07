package jp.classmethod.premembers.report.json.raw.redshift;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RedshiftLoggingStatus {
    @JsonProperty("loggingEnabled")
    private Boolean loggingEnabled;
    private String clusterIdentifier;

    /**
     * Constructor
     *
     * @param loggingEnabled
     * @param clusterIdentifier
     */
    public RedshiftLoggingStatus(Boolean loggingEnabled, String clusterIdentifier) {
        this.loggingEnabled = loggingEnabled;
        this.clusterIdentifier = clusterIdentifier;
    }


    /**
     * constructor default
     */
    public RedshiftLoggingStatus() {
    }

}
