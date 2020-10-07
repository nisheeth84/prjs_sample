package jp.classmethod.premembers.check.security.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_CheckHistory")
public class PMCheckHistory {
    private String checkHistoryID;
    private String organizationID;
    private String projectID;
    private String checkCode;
    private int checkStatus;
    private String errorCode;
    private String executedType;
    private String reportFilePath;
    private String executedDateTime;
    private double timeToLive;
    private String createdAt;
    private String updatedAt;

    // Getter & Setter
    @DynamoDBHashKey(attributeName = "CheckHistoryID")
    public String getCheckHistoryID() {
        return checkHistoryID;
    }

    public void setCheckHistoryID(String checkHistoryID) {
        this.checkHistoryID = checkHistoryID;
    }

    @DynamoDBAttribute(attributeName = "OrganizationID")
    public String getOrganizationID() {
        return organizationID;
    }

    public void setOrganizationID(String organizationID) {
        this.organizationID = organizationID;
    }

    @DynamoDBAttribute(attributeName = "ProjectID")
    public String getProjectID() {
        return projectID;
    }

    public void setProjectID(String projectID) {
        this.projectID = projectID;
    }

    @DynamoDBAttribute(attributeName = "CheckCode")
    public String getCheckCode() {
        return checkCode;
    }

    public void setCheckCode(String checkCode) {
        this.checkCode = checkCode;
    }

    @DynamoDBAttribute(attributeName = "CheckStatus")
    public int getCheckStatus() {
        return checkStatus;
    }

    public void setCheckStatus(int checkStatus) {
        this.checkStatus = checkStatus;
    }

    @DynamoDBAttribute(attributeName = "ErrorCode")
    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    @DynamoDBAttribute(attributeName = "ExecutedType")
    public String getExecutedType() {
        return executedType;
    }

    public void setExecutedType(String executedType) {
        this.executedType = executedType;
    }

    @DynamoDBAttribute(attributeName = "ReportFilePath")
    public String getReportFilePath() {
        return reportFilePath;
    }

    public void setReportFilePath(String reportFilePath) {
        this.reportFilePath = reportFilePath;
    }

    @DynamoDBAttribute(attributeName = "ExecutedDateTime")
    public String getExecutedDateTime() {
        return executedDateTime;
    }

    public void setExecutedDateTime(String executedDateTime) {
        this.executedDateTime = executedDateTime;
    }

    @DynamoDBAttribute(attributeName = "TimeToLive")
    public double getTimeToLive() {
        return timeToLive;
    }

    public void setTimeToLive(double timeToLive) {
        this.timeToLive = timeToLive;
    }

    @DynamoDBAttribute(attributeName = "CreatedAt")
    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    @DynamoDBAttribute(attributeName = "UpdatedAt")
    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
