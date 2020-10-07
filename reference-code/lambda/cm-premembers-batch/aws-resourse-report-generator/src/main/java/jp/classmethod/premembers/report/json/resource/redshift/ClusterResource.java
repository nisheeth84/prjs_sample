package jp.classmethod.premembers.report.json.resource.redshift;

import com.amazonaws.services.redshift.model.Cluster;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ClusterResource extends Cluster {
    private static final long serialVersionUID = 7703054419804484839L;
    @JsonProperty("loggingEnabled")
    private Boolean loggingEnabled;

    // Getter & Setter
    public Boolean getLoggingEnabled() {
        return loggingEnabled;
    }
    public void setLoggingEnabled(Boolean loggingEnabled) {
        this.loggingEnabled = loggingEnabled;
    }
}
