package jp.classmethod.premembers.check.security.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_CheckResultItems")
public class PMCheckResultItems extends PMCheckResultItemsIndex {
    private String organizationID;
    private String projectID;
    private String awsAccountCoopID;
    private int timeToLive;

    // Getter & Setter
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

    @DynamoDBAttribute(attributeName = "AWSAccountCoopID")
    public String getAwsAccountCoopID() {
        return awsAccountCoopID;
    }

    public void setAwsAccountCoopID(String awsAccountCoopID) {
        this.awsAccountCoopID = awsAccountCoopID;
    }

    @DynamoDBAttribute(attributeName = "TimeToLive")
    public int getTimeToLive() {
        return timeToLive;
    }

    public void setTimeToLive(int timeToLive) {
        this.timeToLive = timeToLive;
    }
}
