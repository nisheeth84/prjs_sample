package jp.classmethod.premembers.report.json.report.rds;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DBSnapshotReport {
    @JsonProperty("name")
    private String dBSnapshotIdentifier;
    @JsonProperty("instance_name")
    private String dBInstanceIdentifier;
    @JsonProperty("creation_date")
    private java.util.Date snapshotCreateTime;

    // Getter & Setter
    public String getdBSnapshotIdentifier() {
        return dBSnapshotIdentifier;
    }
    public void setdBSnapshotIdentifier(String dBSnapshotIdentifier) {
        this.dBSnapshotIdentifier = dBSnapshotIdentifier;
    }
    public String getdBInstanceIdentifier() {
        return dBInstanceIdentifier;
    }
    public void setdBInstanceIdentifier(String dBInstanceIdentifier) {
        this.dBInstanceIdentifier = dBInstanceIdentifier;
    }
    public java.util.Date getSnapshotCreateTime() {
        return snapshotCreateTime;
    }
    public void setSnapshotCreateTime(java.util.Date snapshotCreateTime) {
        this.snapshotCreateTime = snapshotCreateTime;
    }
}
