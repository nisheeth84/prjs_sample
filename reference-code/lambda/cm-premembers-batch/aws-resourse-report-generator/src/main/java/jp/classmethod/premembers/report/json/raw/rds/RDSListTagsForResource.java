package jp.classmethod.premembers.report.json.raw.rds;

import java.util.List;

import com.amazonaws.services.rds.model.Tag;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RDSListTagsForResource {
    @JsonProperty("tagList")
    private List<Tag> tagList;
    @JsonProperty("dbInstanceArn")
    private String dbInstanceArn;

    /**
     * Constructor
     *
     * @param tagList
     * @param dBInstanceArn
     */
    public RDSListTagsForResource(List<Tag> tagList, String dbInstanceArn) {
        this.tagList = tagList;
        this.dbInstanceArn = dbInstanceArn;
    }

    /**
     * constructor default
     */
    public RDSListTagsForResource() {
    }
}
