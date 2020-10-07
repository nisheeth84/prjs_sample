package jp.classmethod.premembers.report.json.report.ec2;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2RI {
    private String reservedInstancesId;
    private String instanceType;
    private Integer instanceCount;
    private java.util.Date start;
    private java.util.Date end;
    private String state;
    private String scope;
    private String availabilityZone;
    private String offeringClass;
    private String productDescription;

    // Getter & Setter
    @JsonProperty("RI_ID")
    public String getReservedInstancesId() {
        return reservedInstancesId;
    }
    public void setReservedInstancesId(String reservedInstancesId) {
        this.reservedInstancesId = reservedInstancesId;
    }
    @JsonProperty("Instance_Type")
    public String getInstanceType() {
        return instanceType;
    }
    public void setInstanceType(String instanceType) {
        this.instanceType = instanceType;
    }
    @JsonProperty("Instance_Count")
    public Integer getInstanceCount() {
        return instanceCount;
    }
    public void setInstanceCount(Integer instanceCount) {
        this.instanceCount = instanceCount;
    }
    @JsonProperty("Start")
    public java.util.Date getStart() {
        return start;
    }
    public void setStart(java.util.Date start) {
        this.start = start;
    }
    @JsonProperty("Expires")
    public java.util.Date getEnd() {
        return end;
    }
    public void setEnd(java.util.Date end) {
        this.end = end;
    }
    @JsonProperty("State")
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    @JsonProperty("Scope")
    public String getScope() {
        return scope;
    }
    public void setScope(String scope) {
        this.scope = scope;
    }
    @JsonProperty("Zone")
    public String getAvailabilityZone() {
        return availabilityZone;
    }
    public void setAvailabilityZone(String availabilityZone) {
        this.availabilityZone = availabilityZone;
    }
    @JsonProperty("Offering_Class")
    public String getOfferingClass() {
        return offeringClass;
    }
    public void setOfferingClass(String offeringClass) {
        this.offeringClass = offeringClass;
    }
    @JsonProperty("Platform")
    public String getProductDescription() {
        return productDescription;
    }
    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }
}
