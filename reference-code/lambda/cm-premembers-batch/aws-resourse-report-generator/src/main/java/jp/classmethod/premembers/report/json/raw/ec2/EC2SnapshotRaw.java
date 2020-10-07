package jp.classmethod.premembers.report.json.raw.ec2;

import java.util.List;

import com.amazonaws.services.ec2.model.CreateVolumePermission;
import com.amazonaws.services.ec2.model.Snapshot;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2SnapshotRaw extends Snapshot {
    private static final long serialVersionUID = -4149101642958379619L;

    private List<CreateVolumePermission> createVolumePermissions;

    // Getter & Setter
    @JsonProperty("createVolumePermissions")
    public List<CreateVolumePermission> getCreateVolumePermissions() {
        return createVolumePermissions;
    }
    public void setCreateVolumePermissions(List<CreateVolumePermission> createVolumePermissions) {
        this.createVolumePermissions = createVolumePermissions;
    }
}
