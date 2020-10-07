package jp.classmethod.premembers.check.security.repository;

import java.io.Serializable;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;

import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;

import jp.classmethod.premembers.check.security.util.CommonUtil;
import jp.classmethod.premembers.check.security.util.DateUtil;

public class GenericRepositoryDao<T, PK extends Serializable> {
    private Class<T> type;

    @Value("${dynamodb.endpoint}")
    private String endpoint = "http://localhost:8000";
    @Value("${dynamodb.region}")
    private String region = "ap-northeast-1";
    private AmazonDynamoDB client;
    private DynamoDBMapper mapper;

    public GenericRepositoryDao(Class<T> type) {
        this.type = type;
    }

    @PostConstruct
    private void init() {
        client = AmazonDynamoDBClientBuilder.standard()
                .withEndpointConfiguration(new EndpointConfiguration(endpoint, region)).build();
        mapper = new DynamoDBMapper(client);
    }

    public void create(T o) {
        mapper.save(o);
    }

    public T read(PK id) {
        return mapper.load(type, id);
    }

    public void update(T o, String conditionUpdatedAt) {
        try {
            CommonUtil.doInvokeSetAction(o, "setUpdatedAt", DateUtil.getCurrentDateUTC());
            mapper.save(o, new DynamoDBSaveExpression().withExpectedEntry("UpdatedAt",
                    new ExpectedAttributeValue().withValue(new AttributeValue(conditionUpdatedAt))));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void delete(T o) {
        mapper.delete(o);
    }

    // Getter & Setter
    public DynamoDBMapper getMapper() {
        return mapper;
    }
}
