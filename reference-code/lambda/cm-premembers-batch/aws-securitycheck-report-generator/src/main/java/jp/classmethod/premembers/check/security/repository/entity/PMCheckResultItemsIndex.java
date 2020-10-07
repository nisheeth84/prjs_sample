package jp.classmethod.premembers.check.security.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_CheckResultItems")
public class PMCheckResultItemsIndex {
    private String checkResultItemID;
    private String checkHistoryID;
    private String checkResultID;
    private String checkItemCode;
    private String organizationName;
    private String projectName;
    private String awsAccount;
    private String sortCode;
    private int checkResult;
    private String resultJsonPath;
    private String resultCsvPath;
    private String executedDateTime;
    private int assessmentFlag;
    private int exclusionFlag;
    private String createdAt;
    private String updatedAt;

    // Getter & Setter
    @DynamoDBHashKey(attributeName = "CheckResultItemID")
    public String getCheckResultItemID() {
        return checkResultItemID;
    }

    public void setCheckResultItemID(String checkResultItemID) {
        this.checkResultItemID = checkResultItemID;
    }

    @DynamoDBAttribute(attributeName = "CheckHistoryID")
    public String getCheckHistoryID() {
        return checkHistoryID;
    }

    public void setCheckHistoryID(String checkHistoryID) {
        this.checkHistoryID = checkHistoryID;
    }

    @DynamoDBAttribute(attributeName = "CheckResultID")
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "CheckResultIndex", attributeName = "CheckResultID")
    public String getCheckResultID() {
        return checkResultID;
    }

    public void setCheckResultID(String checkResultID) {
        this.checkResultID = checkResultID;
    }

    @DynamoDBAttribute(attributeName = "CheckItemCode")
    public String getCheckItemCode() {
        return checkItemCode;
    }

    public void setCheckItemCode(String checkItemCode) {
        this.checkItemCode = checkItemCode;
    }

    @DynamoDBAttribute(attributeName = "OrganizationName")
    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    @DynamoDBAttribute(attributeName = "ProjectName")
    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    @DynamoDBAttribute(attributeName = "AWSAccount")
    public String getAwsAccount() {
        return awsAccount;
    }

    public void setAwsAccount(String awsAccount) {
        this.awsAccount = awsAccount;
    }

    @DynamoDBAttribute(attributeName = "SortCode")
    public String getSortCode() {
        return sortCode;
    }

    public void setSortCode(String sortCode) {
        this.sortCode = sortCode;
    }

    @DynamoDBAttribute(attributeName = "CheckResult")
    public int getCheckResult() {
        return checkResult;
    }

    public void setCheckResult(int checkResult) {
        this.checkResult = checkResult;
    }

    @DynamoDBAttribute(attributeName = "ResultJsonPath")
    public String getResultJsonPath() {
        return resultJsonPath;
    }

    public void setResultJsonPath(String resultJsonPath) {
        this.resultJsonPath = resultJsonPath;
    }

    @DynamoDBAttribute(attributeName = "ResultCsvPath")
    public String getResultCsvPath() {
        return resultCsvPath;
    }

    public void setResultCsvPath(String resultCsvPath) {
        this.resultCsvPath = resultCsvPath;
    }

    @DynamoDBAttribute(attributeName = "ExecutedDateTime")
    public String getExecutedDateTime() {
        return executedDateTime;
    }

    public void setExecutedDateTime(String executedDateTime) {
        this.executedDateTime = executedDateTime;
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

    @DynamoDBAttribute(attributeName = "AssessmentFlag")
    public int getAssessmentFlag() {
        return assessmentFlag;
    }

    public void setAssessmentFlag(int assessmentFlag) {
        this.assessmentFlag = assessmentFlag;
    }

    @DynamoDBAttribute(attributeName = "ExclusionFlag")
    public int getExclusionFlag() {
        return exclusionFlag;
    }

    public void setExclusionFlag(int exclusionFlag) {
        this.exclusionFlag = exclusionFlag;
    }
}
