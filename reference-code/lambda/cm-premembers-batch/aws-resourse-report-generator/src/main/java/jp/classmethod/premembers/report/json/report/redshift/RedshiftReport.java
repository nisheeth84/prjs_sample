package jp.classmethod.premembers.report.json.report.redshift;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RedshiftReport {
    @JsonProperty("Clusters")
    private List<RedshiftClustersReport> lsClusters;
    @JsonProperty("Snapshots")
    private List<RedshiftSnapshotReport> lsSnapshot;
    @JsonProperty("RI")
    private List<RedshiftRIReport> lsReservedNode;
}
