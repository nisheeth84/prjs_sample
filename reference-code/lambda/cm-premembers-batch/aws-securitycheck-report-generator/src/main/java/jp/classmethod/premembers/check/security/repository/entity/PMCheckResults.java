package jp.classmethod.premembers.check.security.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_CheckResults")
public class PMCheckResults extends PMCheckResultsIndex {
    private String sortCode;
    private int timeToLive;

    // Getter & Setter
    @DynamoDBAttribute(attributeName = "SortCode")
    public String getSortCode() {
        return sortCode;
    }

    public void setSortCode(String sortCode) {
        this.sortCode = sortCode;
    }

    @DynamoDBAttribute(attributeName = "TimeToLive")
    public int getTimeToLive() {
        return timeToLive;
    }

    public void setTimeToLive(int timeToLive) {
        this.timeToLive = timeToLive;
    }
}
