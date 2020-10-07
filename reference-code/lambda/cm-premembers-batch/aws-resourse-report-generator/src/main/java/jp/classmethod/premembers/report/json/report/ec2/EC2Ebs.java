package jp.classmethod.premembers.report.json.report.ec2;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2Ebs {
    private String name;
    private String volumeId;
    private Integer size;
    private Date createTime;
    private String availabilityZone;

    // Getter & Setter
    @JsonProperty("name")
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("volume_id")
    public String getVolumeId() {
        return volumeId;
    }
    public void setVolumeId(String volumeId) {
        this.volumeId = volumeId;
    }
    @JsonProperty("size")
    public Integer getSize() {
        return size;
    }
    public void setSize(Integer size) {
        this.size = size;
    }
    @JsonProperty("create_time")
    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
    @JsonProperty("availability_zone")
    public String getAvailabilityZone() {
        return availabilityZone;
    }
    public void setAvailabilityZone(String availabilityZone) {
        this.availabilityZone = availabilityZone;
    }
}
