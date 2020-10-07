package jp.classmethod.premembers.report.json.raw.ec2;

import java.util.List;

import com.amazonaws.services.ec2.model.ImageAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2ImagesPermissions {
    private List<ImageAttribute> imageAttributes;

    /**
     * Default constructor
     */
    public EC2ImagesPermissions() {
    }

    /**
     * constructor
     */
    public EC2ImagesPermissions(List<ImageAttribute> imageAttributes) {
        this.imageAttributes = imageAttributes;
    }

    // Getter & Setter
    @JsonProperty("ImageAttributes")
    public List<ImageAttribute> getImageAttributes() {
        return imageAttributes;
    }
    public void setImageAttributes(List<ImageAttribute> imageAttributes) {
        this.imageAttributes = imageAttributes;
    }
}
