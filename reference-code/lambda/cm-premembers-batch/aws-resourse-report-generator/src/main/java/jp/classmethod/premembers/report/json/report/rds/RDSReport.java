package jp.classmethod.premembers.report.json.report.rds;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RDSReport {
    @JsonProperty("DBInstance")
    private List<DBInstanceReport> lsDBInstanceReport;
    @JsonProperty("Snapshots")
    private List<DBSnapshotReport> lsDBSnapshotReport;
    @JsonProperty("RI")
    private List<ReservedDBInstanceReport> lsReservedDBInstanceReport;
}
