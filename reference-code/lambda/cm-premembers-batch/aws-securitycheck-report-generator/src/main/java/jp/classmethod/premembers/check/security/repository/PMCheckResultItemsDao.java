package jp.classmethod.premembers.check.security.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import jp.classmethod.premembers.check.security.repository.entity.PMCheckResultItems;
import jp.classmethod.premembers.check.security.repository.entity.PMCheckResultItemsIndex;

@Component
public class PMCheckResultItemsDao extends GenericRepositoryDao<PMCheckResultItems, String> {
    private String CHECK_RESULT_INDEX = "CheckResultIndex";

    /**
     * Constructor
     */
    public PMCheckResultItemsDao() {
        super(PMCheckResultItems.class);
    }

    public List<PMCheckResultItemsIndex> queryCheckResultIndex(String checkResultID) {
        PMCheckResultItemsIndex hashKeyItem = new PMCheckResultItemsIndex();
        hashKeyItem.setCheckResultID(checkResultID);
        Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
        eav.put(":val1", new AttributeValue().withS(checkResultID));

        DynamoDBQueryExpression<PMCheckResultItemsIndex> queryExpression = new DynamoDBQueryExpression<PMCheckResultItemsIndex>()
                .withIndexName(CHECK_RESULT_INDEX).withConsistentRead(false).withHashKeyValues(hashKeyItem)
                .withSelect("ALL_PROJECTED_ATTRIBUTES");
        return this.getMapper().query(PMCheckResultItemsIndex.class, queryExpression);
    }
}
