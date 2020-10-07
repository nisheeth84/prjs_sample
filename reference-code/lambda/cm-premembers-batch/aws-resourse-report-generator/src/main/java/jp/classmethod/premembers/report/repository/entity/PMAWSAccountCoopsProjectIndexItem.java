package jp.classmethod.premembers.report.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_AWSAccountCoops")
public class PMAWSAccountCoopsProjectIndexItem {
    private String coopID;
    private String awsAccount;
    private String roleName;
    private String externalID;
    private int effective;
    private String organizationID;
    private String projectID;
    private String createdAt;
    private String updatedAt;

    @DynamoDBHashKey(attributeName = "CoopID")
    public String getCoopId() {
        return coopID;
    }

    public void setCoopId(String coopID) {
        this.coopID = coopID;
    }

    @DynamoDBAttribute(attributeName = "AWSAccount")
    @DynamoDBIndexRangeKey(globalSecondaryIndexName = "ProjectIndex", attributeName = "AWSAccount")
    public String getAWSAccount() {
        return awsAccount;
    }

    public void setAWSAccount(String awsAccount) {
        this.awsAccount = awsAccount;
    }

    @DynamoDBAttribute(attributeName = "RoleName")
    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @DynamoDBAttribute(attributeName = "ExternalID")
    public String getExternalID() {
        return externalID;
    }

    public void setExternalID(String externalID) {
        this.externalID = externalID;
    }

    @DynamoDBAttribute(attributeName = "Effective")
    public int getEffective() {
        return effective;
    }

    public void setEffective(int effective) {
        this.effective = effective;
    }

    @DynamoDBAttribute(attributeName = "OrganizationID")
    public String getOrganizationID() {
        return organizationID;
    }

    public void setOrganizationID(String organizationID) {
        this.organizationID = organizationID;
    }

    @DynamoDBAttribute(attributeName = "ProjectID")
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "ProjectIndex", attributeName = "ProjectID")
    public String getProjectID() {
        return projectID;
    }

    public void setProjectID(String projectID) {
        this.projectID = projectID;
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
