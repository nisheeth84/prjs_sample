package jp.classmethod.premembers.report.json.report.rds;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReservedDBInstanceReport {
    @JsonProperty("RI_ID")
    private String reservedDBInstanceId;
    @JsonProperty("DB_Instance_Class")
    private String dBInstanceClass;
    @JsonProperty("Offering_Type")
    private String offeringType;
    @JsonProperty("Start")
    private java.util.Date startTime;
    @JsonProperty("Remaining_Day")
    private Integer remainingDay;
    @JsonProperty("State")
    private String state;
    @JsonProperty("Multi_AZ")
    private Boolean multiAZ;
    @JsonProperty("DB_Instance_Count")
    private Integer dBInstanceCount;

    // Getter & Setter
    public String getReservedDBInstanceId() {
        return reservedDBInstanceId;
    }
    public void setReservedDBInstanceId(String reservedDBInstanceId) {
        this.reservedDBInstanceId = reservedDBInstanceId;
    }
    public String getdBInstanceClass() {
        return dBInstanceClass;
    }
    public void setdBInstanceClass(String dBInstanceClass) {
        this.dBInstanceClass = dBInstanceClass;
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
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public Boolean getMultiAZ() {
        return multiAZ;
    }
    public void setMultiAZ(Boolean multiAZ) {
        this.multiAZ = multiAZ;
    }
    public Integer getdBInstanceCount() {
        return dBInstanceCount;
    }
    public void setdBInstanceCount(Integer dBInstanceCount) {
        this.dBInstanceCount = dBInstanceCount;
    }
    public Integer getRemainingDay() {
        return remainingDay;
    }
    public void setRemainingDay(Integer remainingDay) {
        this.remainingDay = remainingDay;
    }
}
