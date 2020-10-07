package jp.classmethod.premembers.report.json.report.ec2;

import java.util.Date;
import java.util.List;

import com.amazonaws.services.ec2.model.GroupIdentifier;
import com.amazonaws.services.ec2.model.Tag;
import com.fasterxml.jackson.annotation.JsonProperty;

import jp.classmethod.premembers.report.constant.ComConst;

public class EC2Instance {
    private String name = ComConst.BLANK;
    private String instanceId = ComConst.BLANK;
    private String instanceType = ComConst.BLANK;
    private List<GroupIdentifier> securityGroups;
    private String vpcId = ComConst.BLANK;
    private String keyName = ComConst.BLANK;
    private String availabilityZone = ComConst.BLANK;
    private Date launchTime;
    List<Tag> tags;

    // Getter & Setter
    @JsonProperty("name")
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("instance_id")
    public String getInstanceId() {
        return instanceId;
    }
    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }
    @JsonProperty("instance_type")
    public String getInstanceType() {
        return instanceType;
    }
    public void setInstanceType(String instanceType) {
        this.instanceType = instanceType;
    }
    @JsonProperty("security_groups")
    public List<GroupIdentifier> getSecurityGroups() {
        return securityGroups;
    }
    public void setSecurityGroups(List<GroupIdentifier> securityGroups) {
        this.securityGroups = securityGroups;
    }
    @JsonProperty("vpc_id")
    public String getVpcId() {
        return vpcId;
    }
    public void setVpcId(String vpcId) {
        this.vpcId = vpcId;
    }
    @JsonProperty("key_name")
    public String getKeyName() {
        return keyName;
    }
    public void setKeyName(String keyName) {
        this.keyName = keyName;
    }
    @JsonProperty("availability_zone")
    public String getAvailabilityZone() {
        return availabilityZone;
    }
    public void setAvailabilityZone(String availabilityZone) {
        this.availabilityZone = availabilityZone;
    }
    @JsonProperty("launch_time")
    public Date getLaunchTime() {
        return launchTime;
    }
    public void setLaunchTime(Date launchTime) {
        this.launchTime = launchTime;
    }
    @JsonProperty("tag")
    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
