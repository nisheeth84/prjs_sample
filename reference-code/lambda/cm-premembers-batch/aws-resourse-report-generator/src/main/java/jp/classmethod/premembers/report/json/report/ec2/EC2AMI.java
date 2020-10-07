package jp.classmethod.premembers.report.json.report.ec2;

import java.util.List;

import com.amazonaws.services.ec2.model.LaunchPermission;
import com.fasterxml.jackson.annotation.JsonProperty;

import jp.classmethod.premembers.report.constant.ComConst;

public class EC2AMI {
    private String name;
    private String nameTag = ComConst.BLANK;
    private String imageId;
    private Boolean publicValue = false;
    private String imageLocation = ComConst.BLANK;
    private String creationDate;
    private List<LaunchPermission> launchPermissions;

    // Getter & Setter
    @JsonProperty("name")
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("name_tag")
    public String getNameTag() {
        return nameTag;
    }
    public void setNameTag(String nameTag) {
        this.nameTag = nameTag;
    }
    @JsonProperty("image_id")
    public String getImageId() {
        return imageId;
    }
    public void setImageId(String imageId) {
        this.imageId = imageId;
    }
    @JsonProperty("public")
    public Boolean getPublicValue() {
        return publicValue;
    }
    public void setPublicValue(Boolean publicValue) {
        this.publicValue = publicValue;
    }
    @JsonProperty("source")
    public String getImageLocation() {
        return imageLocation;
    }
    public void setImageLocation(String imageLocation) {
        this.imageLocation = imageLocation;
    }
    @JsonProperty("creation_date")
    public String getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }
    @JsonProperty("shared_aws_account")
    public List<LaunchPermission> getLaunchPermissions() {
        return launchPermissions;
    }
    public void setLaunchPermissions(List<LaunchPermission> launchPermissions) {
        this.launchPermissions = launchPermissions;
    }
}
