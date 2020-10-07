package jp.classmethod.premembers.report.json.resource.redshift;

import java.util.List;

import com.amazonaws.services.redshift.model.ReservedNode;
import com.amazonaws.services.redshift.model.Snapshot;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RedshiftResource {
    @JsonProperty("Clusters")
    private List<ClusterResource> lsClusterResource;
    @JsonProperty("Snapshots")
    private List<Snapshot> lsSnapshot;
    @JsonProperty("RI")
    private List<ReservedNode> lsReservedNode;
}
