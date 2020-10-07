package jp.classmethod.premembers.report.repository;

import java.util.List;
import org.springframework.stereotype.Component;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import jp.classmethod.premembers.report.repository.entity.PMReportsItem;
import jp.classmethod.premembers.report.repository.entity.PMReportsProjectIndexItem;

@Component
public class PMReports extends GenericRepository<PMReportsItem, String> {
    private String PROJECT_INDEX = "ProjectIndex";
    /**
     * Constructor
     */
    public PMReports() {
        super(PMReportsItem.class);
    }

    public void deleteItem(String reportId) {
        this.getMapper().delete(new PMReportsItem(reportId));
    }

    public List<PMReportsProjectIndexItem> queryProjectIndex(String projectId) {
        PMReportsProjectIndexItem hashKeyItem = new PMReportsProjectIndexItem();
        hashKeyItem.setProjectId(projectId);
        DynamoDBQueryExpression<PMReportsProjectIndexItem> queryExpression = new DynamoDBQueryExpression<PMReportsProjectIndexItem>()
                .withIndexName(PROJECT_INDEX).withConsistentRead(false).withHashKeyValues(hashKeyItem);
        return this.getMapper().query(PMReportsProjectIndexItem.class, queryExpression);
    }

    public int getCountAll() {
        return this.getMapper().count(PMReportsItem.class, new DynamoDBScanExpression());
    }

}
