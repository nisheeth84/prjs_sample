package jp.classmethod.premembers.check.security.repository;

import java.util.List;

import org.springframework.stereotype.Component;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;

import jp.classmethod.premembers.check.security.repository.entity.PMCheckResults;
import jp.classmethod.premembers.check.security.repository.entity.PMCheckResultsIndex;

@Component
public class PMCheckResultsDao extends GenericRepositoryDao<PMCheckResults, String> {
    private String CHECK_HISTORY_INDEX = "CheckHistoryIndex";

    /**
     * Constructor
     */
    public PMCheckResultsDao() {
        super(PMCheckResults.class);
    }

    public List<PMCheckResultsIndex> queryCheckHistoryIndex(String checkHistoryId) {
        PMCheckResultsIndex hashKeyItem = new PMCheckResultsIndex();
        hashKeyItem.setCheckHistoryID(checkHistoryId);
        DynamoDBQueryExpression<PMCheckResultsIndex> queryExpression = new DynamoDBQueryExpression<PMCheckResultsIndex>()
                .withIndexName(CHECK_HISTORY_INDEX).withConsistentRead(false).withHashKeyValues(hashKeyItem);
        return this.getMapper().query(PMCheckResultsIndex.class, queryExpression);
    }
}
