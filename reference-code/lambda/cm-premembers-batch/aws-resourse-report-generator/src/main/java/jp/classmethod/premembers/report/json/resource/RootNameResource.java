package jp.classmethod.premembers.report.json.resource;

import com.fasterxml.jackson.annotation.JsonProperty;

import jp.classmethod.premembers.report.json.resource.rds.RDSResource;
import jp.classmethod.premembers.report.json.resource.redshift.RedshiftResource;
import lombok.Data;

@Data
public class RootNameResource {
    @JsonProperty("schema_version")
    private String schemaVersion;
    @JsonProperty("RDS")
    private RDSResource rds; // RDS.json
    @JsonProperty("Redshift")
    private RedshiftResource redshift; // Redshift.json
}
