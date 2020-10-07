package jp.classmethod.premembers.report.json.report.redshift;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RedshiftClustersReport {
    @JsonProperty("cluster_identifier")
    private String clusterIdentifier;
    @JsonProperty("node_type")
    private String nodeType;
    @JsonProperty("number_of_nodes")
    private Integer numberOfNodes;
    @JsonProperty("vpc_id")
    private String vpcId;
    @JsonProperty("availability_zone")
    private String availabilityZone;
    @JsonProperty("publicly_accessible")
    private Boolean publiclyAccessible;
    @JsonProperty("storage_encrypted")
    private Boolean encrypted;
    @JsonProperty("audit_logging")
    private Boolean loggingEnabled;

    // Getter & Setter
    public String getClusterIdentifier() {
        return clusterIdentifier;
    }
    public void setClusterIdentifier(String clusterIdentifier) {
        this.clusterIdentifier = clusterIdentifier;
    }
    public String getNodeType() {
        return nodeType;
    }
    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }
    public Integer getNumberOfNodes() {
        return numberOfNodes;
    }
    public void setNumberOfNodes(Integer numberOfNodes) {
        this.numberOfNodes = numberOfNodes;
    }
    public String getVpcId() {
        return vpcId;
    }
    public void setVpcId(String vpcId) {
        this.vpcId = vpcId;
    }
    public String getAvailabilityZone() {
        return availabilityZone;
    }
    public void setAvailabilityZone(String availabilityZone) {
        this.availabilityZone = availabilityZone;
    }
    public Boolean getPubliclyAccessible() {
        return publiclyAccessible;
    }
    public void setPubliclyAccessible(Boolean publiclyAccessible) {
        this.publiclyAccessible = publiclyAccessible;
    }
    public Boolean getEncrypted() {
        return encrypted;
    }
    public void setEncrypted(Boolean encrypted) {
        this.encrypted = encrypted;
    }
    public Boolean getLoggingEnabled() {
        return loggingEnabled;
    }
    public void setLoggingEnabled(Boolean loggingEnabled) {
        this.loggingEnabled = loggingEnabled;
    }
}
