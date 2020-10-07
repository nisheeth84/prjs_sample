package jp.classmethod.premembers.check.security.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_CheckResults")
public class PMCheckResultsIndex {
    private String checkResultID;
    private String checkHistoryID;
    private String checkRuleCode;
    private String organizationID;
    private String organizationName;
    private String projectID;
    private String projectName;
    private String awsAccountCoopID;
    private String awsAccount;
    private String awsAccountName;
    private int okCount;
    private int managedCount;
    private int criticalCount;
    private int ngCount;
    private String executedDateTime;
    private String createdAt;
    private String updatedAt;

    // Getter & Setter
    @DynamoDBHashKey(attributeName = "CheckResultID")
    public String getCheckResultID() {
        return checkResultID;
    }

    public void setCheckResultID(String checkResultID) {
        this.checkResultID = checkResultID;
    }

    @DynamoDBAttribute(attributeName = "CheckHistoryID")
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "CheckHistoryIndex", attributeName = "CheckHistoryID")
    public String getCheckHistoryID() {
        return checkHistoryID;
    }

    public void setCheckHistoryID(String checkHistoryID) {
        this.checkHistoryID = checkHistoryID;
    }

    @DynamoDBAttribute(attributeName = "CheckRuleCode")
    public String getCheckRuleCode() {
        return checkRuleCode;
    }

    public void setCheckRuleCode(String checkRuleCode) {
        this.checkRuleCode = checkRuleCode;
    }

    @DynamoDBAttribute(attributeName = "OrganizationID")
    public String getOrganizationID() {
        return organizationID;
    }

    public void setOrganizationID(String organizationID) {
        this.organizationID = organizationID;
    }

    @DynamoDBAttribute(attributeName = "OrganizationName")
    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    @DynamoDBAttribute(attributeName = "ProjectID")
    public String getProjectID() {
        return projectID;
    }

    public void setProjectID(String projectID) {
        this.projectID = projectID;
    }

    @DynamoDBAttribute(attributeName = "ProjectName")
    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    @DynamoDBAttribute(attributeName = "AWSAccountCoopID")
    public String getAwsAccountCoopID() {
        return awsAccountCoopID;
    }

    public void setAwsAccountCoopID(String awsAccountCoopID) {
        this.awsAccountCoopID = awsAccountCoopID;
    }

    @DynamoDBAttribute(attributeName = "AWSAccount")
    public String getAwsAccount() {
        return awsAccount;
    }

    public void setAwsAccount(String awsAccount) {
        this.awsAccount = awsAccount;
    }

    @DynamoDBAttribute(attributeName = "AWSAccountName")
    public String getAwsAccountName() {
        return awsAccountName;
    }

    public void setAwsAccountName(String awsAccountName) {
        this.awsAccountName = awsAccountName;
    }

    @DynamoDBAttribute(attributeName = "OKCount")
    public int getOkCount() {
        return okCount;
    }

    public void setOkCount(int okCount) {
        this.okCount = okCount;
    }

    @DynamoDBAttribute(attributeName = "ManagedCount")
    public int getManagedCount() {
        return managedCount;
    }

    public void setManagedCount(int managedCount) {
        this.managedCount = managedCount;
    }

    @DynamoDBAttribute(attributeName = "CriticalCount")
    public int getCriticalCount() {
        return criticalCount;
    }

    public void setCriticalCount(int criticalCount) {
        this.criticalCount = criticalCount;
    }

    @DynamoDBAttribute(attributeName = "NGCount")
    public int getNgCount() {
        return ngCount;
    }

    public void setNgCount(int ngCount) {
        this.ngCount = ngCount;
    }

    @DynamoDBAttribute(attributeName = "ExecutedDateTime")
    public String getExecutedDateTime() {
        return executedDateTime;
    }

    public void setExecutedDateTime(String executedDateTime) {
        this.executedDateTime = executedDateTime;
    }

    @DynamoDBAttribute(attributeName = "CreatedAt")
    @DynamoDBIndexRangeKey(globalSecondaryIndexName = "CheckHistoryIndex", attributeName = "CreatedAt")
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
