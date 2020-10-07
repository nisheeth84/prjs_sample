package jp.classmethod.premembers.report.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_AWSAccountCoops")
public class PMAWSAccountCoopsItem extends PMAWSAccountCoopsProjectIndexItem {
    private String description;

    /**
     * Constructor
     */
    public PMAWSAccountCoopsItem(String coopID) {
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
