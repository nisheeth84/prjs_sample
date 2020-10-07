package jp.classmethod.premembers.report.repository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.stereotype.Component;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.Condition;
import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.repository.entity.PMAWSAccountCoopsItem;
import jp.classmethod.premembers.report.repository.entity.PMAWSAccountCoopsProjectIndexItem;

@Component
public class PMAWSAccountCoops extends GenericRepository<PMAWSAccountCoopsItem, Integer> {
    /**
     * Constructor
     */
    public PMAWSAccountCoops() {
        super(PMAWSAccountCoopsItem.class);
    }

    public void deleteItem(String coopID) {
        delete(new PMAWSAccountCoopsItem(coopID));
    }

    public List<PMAWSAccountCoopsProjectIndexItem> queryProjectIndexFilterEffectiveEnable(String projectId,
            String awsAccount) {
        PMAWSAccountCoopsProjectIndexItem hashKeyItem = new PMAWSAccountCoopsProjectIndexItem();
        hashKeyItem.setProjectID(projectId);

        // Filter Expression
        Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
        expressionAttributeValues.put(":effective", new AttributeValue().withN(ComConst.EFFECTIVE_ENABLE));

        DynamoDBQueryExpression<PMAWSAccountCoopsProjectIndexItem> queryExpression = new DynamoDBQueryExpression<PMAWSAccountCoopsProjectIndexItem>()
                .withIndexName("ProjectIndex").withConsistentRead(false).withHashKeyValues(hashKeyItem)
                .withRangeKeyCondition("AWSAccount",
                        new Condition().withComparisonOperator(ComparisonOperator.EQ)
                                .withAttributeValueList(new AttributeValue(awsAccount)))
                .withFilterExpression("Effective = :effective")
                .withExpressionAttributeValues(expressionAttributeValues)
                .withSelect("ALL_PROJECTED_ATTRIBUTES");
        return this.getMapper().query(PMAWSAccountCoopsProjectIndexItem.class, queryExpression);
    }

    public int getCountAll() {
        return this.getMapper().count(PMAWSAccountCoopsProjectIndexItem.class, new DynamoDBScanExpression());
    }
}
