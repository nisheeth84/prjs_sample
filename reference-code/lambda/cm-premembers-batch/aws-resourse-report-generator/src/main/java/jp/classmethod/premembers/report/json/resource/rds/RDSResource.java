package jp.classmethod.premembers.report.json.resource.rds;

import java.util.List;

import com.amazonaws.services.rds.model.DBSnapshot;
import com.amazonaws.services.rds.model.ReservedDBInstance;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RDSResource {
    @JsonProperty("DBInstance")
    private List<DBInstanceResource> lsDbInstances;
    @JsonProperty("Snapshots")
    private List<DBSnapshot> lsDbSnapshots;
    @JsonProperty("RI")
    private List<ReservedDBInstance> lsReservedDBInstances;
}
