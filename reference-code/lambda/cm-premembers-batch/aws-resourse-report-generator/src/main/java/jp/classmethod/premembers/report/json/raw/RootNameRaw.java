package jp.classmethod.premembers.report.json.raw;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jp.classmethod.premembers.report.json.raw.rds.RDSListTagsForResource;
import jp.classmethod.premembers.report.json.raw.redshift.RedshiftLoggingStatus;
import lombok.Data;

@Data
public class RootNameRaw {
    @JsonProperty("listTagsForResourceResult")
    private List<RDSListTagsForResource> lsRDSListTagsForResource; // RDS_ListTagsForResource.json
    @JsonProperty("listLoggingStatusResult")
    private List<RedshiftLoggingStatus> lsRedshiftLoggingStatus; // Redshift_LoggingStatus.json
}
