package jp.classmethod.premembers.report.json.raw.ec2;

import java.util.List;

import com.amazonaws.services.ec2.model.DescribeSnapshotAttributeResult;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2SnapshotsPermissions {
    private List<DescribeSnapshotAttributeResult> snapshotAttributes;

    /**
     * Default constructor
     */
    public EC2SnapshotsPermissions() {
    }

    /**
     * constructor
     */
    public EC2SnapshotsPermissions(List<DescribeSnapshotAttributeResult> snapshotAttributes) {
        this.snapshotAttributes = snapshotAttributes;
    }

    // Getter & Setter
    @JsonProperty("SnapshotAttributes")
    public List<DescribeSnapshotAttributeResult> getImageAttributes() {
        return snapshotAttributes;
    }
    public void setImageAttributes(List<DescribeSnapshotAttributeResult> snapshotAttributes) {
        this.snapshotAttributes = snapshotAttributes;
    }
}
