package jp.classmethod.premembers.check.security.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_AWSAccountCoops")
public class PMAWSAccountCoops extends PMAWSAccountCoopsIndex {
    private String description;

    /**
     * Default Constructor
     */
    public PMAWSAccountCoops() {
    }

    /**
     * Constructor
     */
    public PMAWSAccountCoops(String coopID) {
        this.setCoopId(coopID);
    }

    @DynamoDBAttribute(attributeName = "Description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
