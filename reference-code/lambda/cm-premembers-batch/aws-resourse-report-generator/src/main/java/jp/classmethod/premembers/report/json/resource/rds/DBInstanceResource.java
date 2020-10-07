package jp.classmethod.premembers.report.json.resource.rds;

import java.util.List;

import com.amazonaws.services.rds.model.DBInstance;
import com.amazonaws.services.rds.model.Tag;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DBInstanceResource extends DBInstance {
    private static final long serialVersionUID = 7703054419804484839L;
    @JsonProperty("tagList")
    private List<Tag> tagList;

    // Getter & Setter
    public List<Tag> getTagList() {
        return tagList;
    }
    public void setTagList(List<Tag> tagList) {
        this.tagList = tagList;
    }
}
