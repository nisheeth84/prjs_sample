package jp.classmethod.premembers.report.json.report.ec2;

import java.util.Date;
import java.util.List;

import com.amazonaws.services.ec2.model.CreateVolumePermission;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2Snapshot {
    private String name;
    private String snapshotId;
    private Integer volumeSize;
    private String description;
    private Date startTime;
    private Boolean encrypted;
    private List<CreateVolumePermission> createVolumePermissions;

    // Getter & Setter
    @JsonProperty("name")
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("id")
    public String getSnapshotId() {
        return snapshotId;
    }
    public void setSnapshotId(String snapshotId) {
        this.snapshotId = snapshotId;
    }
    @JsonProperty("volume_size")
    public Integer getVolumeSize() {
        return volumeSize;
    }
    public void setVolumeSize(Integer volumeSize) {
        this.volumeSize = volumeSize;
    }
    @JsonProperty("description")
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    @JsonProperty("start_time")
    public Date getStartTime() {
        return startTime;
    }
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
    @JsonProperty("public")
    public Boolean getEncrypted() {
        return encrypted;
    }
    public void setEncrypted(Boolean encrypted) {
        this.encrypted = encrypted;
    }
    @JsonProperty("shared_aws_account")
    public List<CreateVolumePermission> getCreateVolumePermissions() {
        return createVolumePermissions;
    }
    public void setCreateVolumePermissions(List<CreateVolumePermission> createVolumePermissions) {
        this.createVolumePermissions = createVolumePermissions;
    }
}
