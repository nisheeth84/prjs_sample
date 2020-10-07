package jp.classmethod.premembers.report.json.raw.ec2;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2RootName {
    private String schemaVersion;
    private EC2 ec2;

    // Getter & Setter
    @JsonProperty("EC2")
    public EC2 getEc2() {
        return ec2;
    }
    public void setEc2(EC2 ec2) {
        this.ec2 = ec2;
    }
    @JsonProperty("schema_version")
    public String getSchemaVersion() {
        return schemaVersion;
    }
    public void setSchemaVersion(String schemaVersion) {
        this.schemaVersion = schemaVersion;
    }
}
