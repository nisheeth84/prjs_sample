package jp.classmethod.premembers.report.json.report.rds;

import java.util.List;

import com.amazonaws.services.rds.model.Tag;
import com.amazonaws.services.rds.model.VpcSecurityGroupMembership;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DBInstanceReport {
    @JsonProperty("name")
    private String dBInstanceIdentifier;
    @JsonProperty("vpc_id")
    private String vpcId;
    @JsonProperty("multi_az")
    private Boolean multiAZ;
    @JsonProperty("class")
    private String dBInstanceClass;
    @JsonProperty("storage")
    private Integer allocatedStorage;
    @JsonProperty("security_groups")
    List<VpcSecurityGroupMembership> vpcSecurityGroups;
    @JsonProperty("engine")
    private String engine;
    @JsonProperty("AvailabilityZone")
    private String availabilityZone;
    @JsonProperty("creation_date")
    private java.util.Date instanceCreateTime;
    @JsonProperty("publicly_accessible")
    private Boolean publiclyAccessible;
    @JsonProperty("storage_encrypted")
    private Boolean storageEncrypted;
    @JsonProperty("status")
    private String dBInstanceStatus;
    @JsonProperty("tag")
    private List<Tag> tagList;

    // Getter & Setter
    public String getAvailabilityZone() {
        return availabilityZone;
    }
    public void setAvailabilityZone(String availabilityZone) {
        this.availabilityZone = availabilityZone;
    }
    public String getdBInstanceIdentifier() {
        return dBInstanceIdentifier;
    }
    public void setdBInstanceIdentifier(String dBInstanceIdentifier) {
        this.dBInstanceIdentifier = dBInstanceIdentifier;
    }
    public String getVpcId() {
        return vpcId;
    }
    public void setVpcId(String vpcId) {
        this.vpcId = vpcId;
    }
    public Boolean getMultiAZ() {
        return multiAZ;
    }
    public void setMultiAZ(Boolean multiAZ) {
        this.multiAZ = multiAZ;
    }
    public String getdBInstanceClass() {
        return dBInstanceClass;
    }
    public void setdBInstanceClass(String dBInstanceClass) {
        this.dBInstanceClass = dBInstanceClass;
    }
    public List<VpcSecurityGroupMembership> getVpcSecurityGroups() {
        return vpcSecurityGroups;
    }
    public void setVpcSecurityGroups(List<VpcSecurityGroupMembership> vpcSecurityGroups) {
        this.vpcSecurityGroups = vpcSecurityGroups;
    }
    public String getEngine() {
        return engine;
    }
    public void setEngine(String engine) {
        this.engine = engine;
    }
    public java.util.Date getInstanceCreateTime() {
        return instanceCreateTime;
    }
    public void setInstanceCreateTime(java.util.Date instanceCreateTime) {
        this.instanceCreateTime = instanceCreateTime;
    }
    public Boolean getPubliclyAccessible() {
        return publiclyAccessible;
    }
    public void setPubliclyAccessible(Boolean publiclyAccessible) {
        this.publiclyAccessible = publiclyAccessible;
    }
    public Boolean getStorageEncrypted() {
        return storageEncrypted;
    }
    public void setStorageEncrypted(Boolean storageEncrypted) {
        this.storageEncrypted = storageEncrypted;
    }
    public List<Tag> getTagList() {
        return tagList;
    }
    public void setTagList(List<Tag> tagList) {
        this.tagList = tagList;
    }
    public Integer getAllocatedStorage() {
        return allocatedStorage;
    }
    public void setAllocatedStorage(Integer allocatedStorage) {
        this.allocatedStorage = allocatedStorage;
    }
    public String getdBInstanceStatus() {
        return dBInstanceStatus;
    }
    public void setdBInstanceStatus(String dBInstanceStatus) {
        this.dBInstanceStatus = dBInstanceStatus;
    }
}
