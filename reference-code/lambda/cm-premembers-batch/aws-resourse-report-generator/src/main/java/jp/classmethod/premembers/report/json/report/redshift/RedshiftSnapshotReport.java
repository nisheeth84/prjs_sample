package jp.classmethod.premembers.report.json.report.redshift;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RedshiftSnapshotReport {
    @JsonProperty("name")
    private String snapshotIdentifier;
    @JsonProperty("instance_name")
    private String clusterIdentifier;
    @JsonProperty("creation_date")
    private java.util.Date snapshotCreateTime;

    // Getter & Setter
    public String getSnapshotIdentifier() {
        return snapshotIdentifier;
    }
    public void setSnapshotIdentifier(String snapshotIdentifier) {
        this.snapshotIdentifier = snapshotIdentifier;
    }
    public String getClusterIdentifier() {
        return clusterIdentifier;
    }
    public void setClusterIdentifier(String clusterIdentifier) {
        this.clusterIdentifier = clusterIdentifier;
    }
    public java.util.Date getSnapshotCreateTime() {
        return snapshotCreateTime;
    }
    public void setSnapshotCreateTime(java.util.Date snapshotCreateTime) {
        this.snapshotCreateTime = snapshotCreateTime;
    }
}
