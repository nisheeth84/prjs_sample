package jp.classmethod.premembers.report.repository.entity;

import java.util.List;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_Reports")
public class PMReportsProjectIndexItem {
    private String reportId;
    private String reportName;
    private String generateUser;
    private List<String> awsAccounts;
    private int reportStatus;
    private String errorCode;
    private String jsonOutputTime;
    private int htmlOutputStatus;
    private String htmlOutputTime;
    private int excelOutputStatus;
    private String excelOutputTime;
    private double schemaVersion;
    private String organizationId;
    private String projectId;
    private String createdAt;
    private String updatedAt;

    @DynamoDBHashKey(attributeName = "ReportID")
    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    @DynamoDBAttribute(attributeName = "ReportName")
    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    @DynamoDBAttribute(attributeName = "GenerateUser")
    public String getGenerateUser() {
        return generateUser;
    }

    public void setGenerateUser(String generateUser) {
        this.generateUser = generateUser;
    }

    @DynamoDBAttribute(attributeName = "AWSAccounts")
    public List<String> getAwsAccounts() {
        return awsAccounts;
    }

    public void setAwsAccounts(List<String> awsAccounts) {
        this.awsAccounts = awsAccounts;
    }

    @DynamoDBAttribute(attributeName = "ReportStatus")
    public int getReportStatus() {
        return reportStatus;
    }

    public void setReportStatus(int reportStatus) {
        this.reportStatus = reportStatus;
    }

    @DynamoDBAttribute(attributeName = "ErrorCode")
    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    @DynamoDBAttribute(attributeName = "JsonOutputTime")
    public String getJsonOutputTime() {
        return jsonOutputTime;
    }

    public void setJsonOutputTime(String jsonOutputTime) {
        this.jsonOutputTime = jsonOutputTime;
    }

    @DynamoDBAttribute(attributeName = "HTMLOutputStatus")
    public int getHtmlOutputStatus() {
        return htmlOutputStatus;
    }

    public void setHtmlOutputStatus(int htmlOutputStatus) {
        this.htmlOutputStatus = htmlOutputStatus;
    }

    @DynamoDBAttribute(attributeName = "HTMLOutputTime")
    public String getHtmlOutputTime() {
        return htmlOutputTime;
    }

    public void setHtmlOutputTime(String htmlOutputTime) {
        this.htmlOutputTime = htmlOutputTime;
    }

    @DynamoDBAttribute(attributeName = "ExcelOutputStatus")
    public int getExcelOutputStatus() {
        return excelOutputStatus;
    }

    public void setExcelOutputStatus(int excelOutputStatus) {
        this.excelOutputStatus = excelOutputStatus;
    }

    @DynamoDBAttribute(attributeName = "ExcelOutputTime")
    public String getExcelOutputTime() {
        return excelOutputTime;
    }

    public void setExcelOutputTime(String excelOutputTime) {
        this.excelOutputTime = excelOutputTime;
    }

    @DynamoDBAttribute(attributeName = "SchemaVersion")
    public double getSchemaVersion() {
        return schemaVersion;
    }

    public void setSchemaVersion(double schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    @DynamoDBAttribute(attributeName = "OrganizationID")
    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    @DynamoDBAttribute(attributeName = "ProjectID")
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "ProjectIndex", attributeName = "ProjectID")
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    @DynamoDBAttribute(attributeName = "CreatedAt")
    @DynamoDBIndexRangeKey(globalSecondaryIndexName = "ProjectIndex", attributeName = "CreatedAt")
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
