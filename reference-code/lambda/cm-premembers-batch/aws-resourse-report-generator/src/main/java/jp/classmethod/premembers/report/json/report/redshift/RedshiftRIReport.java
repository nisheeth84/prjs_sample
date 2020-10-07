package jp.classmethod.premembers.report.json.report.redshift;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RedshiftRIReport {
    @JsonProperty("RI_ID")
    private String reservedNodeId;
    @JsonProperty("Node_Type")
    private String nodeType;
    @JsonProperty("Offering_Type")
    private String offeringType;
    @JsonProperty("Start")
    private java.util.Date startTime;
    @JsonProperty("Remaining_Day")
    private Integer remainingDay;
    @JsonProperty("State")
    private String state;
    @JsonProperty("Node_Count")
    private Integer nodeCount;

    // Getter & Setter
    public String getReservedNodeId() {
        return reservedNodeId;
    }
    public void setReservedNodeId(String reservedNodeId) {
        this.reservedNodeId = reservedNodeId;
    }
    public String getNodeType() {
        return nodeType;
    }
    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }
    public String getOfferingType() {
        return offeringType;
    }
    public void setOfferingType(String offeringType) {
        this.offeringType = offeringType;
    }
    public java.util.Date getStartTime() {
        return startTime;
    }
    public void setStartTime(java.util.Date startTime) {
        this.startTime = startTime;
    }
    public Integer getRemainingDay() {
        return remainingDay;
    }
    public void setRemainingDay(Integer remainingDay) {
        this.remainingDay = remainingDay;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public Integer getNodeCount() {
        return nodeCount;
    }
    public void setNodeCount(Integer nodeCount) {
        this.nodeCount = nodeCount;
    }
}
