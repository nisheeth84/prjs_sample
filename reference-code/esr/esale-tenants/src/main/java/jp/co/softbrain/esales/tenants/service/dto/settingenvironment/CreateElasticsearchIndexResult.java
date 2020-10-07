package jp.co.softbrain.esales.tenants.service.dto.settingenvironment;

import java.util.List;

import org.elasticsearch.client.indices.CreateIndexResponse;

import lombok.Value;

/**
 * Include all of result after create Elasticsearch index
 *
 * @author tongminhcuong
 */
@Value
public class CreateElasticsearchIndexResult {

    private boolean successfully;

    private List<CreateIndexResponse> createIndexResponses;

    private String errorMessage;
}
