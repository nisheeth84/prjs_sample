package jp.classmethod.premembers.report.json.raw.ec2;

import java.util.List;

import com.amazonaws.services.ec2.model.Image;
import com.amazonaws.services.ec2.model.LaunchPermission;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2ImageRaw extends Image {
    private static final long serialVersionUID = -7183977855236253343L;

    private List<LaunchPermission> launchPermissions;

    // Getter & Setter
    @JsonProperty("launchPermissions")
    public List<LaunchPermission> getLaunchPermissions() {
        return launchPermissions;
    }
    public void setLaunchPermissions(List<LaunchPermission> launchPermissions) {
        this.launchPermissions = launchPermissions;
    }
}
