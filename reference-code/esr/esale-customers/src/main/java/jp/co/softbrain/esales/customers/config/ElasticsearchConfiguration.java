package jp.co.softbrain.esales.customers.config;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jp.co.softbrain.esales.elasticsearch.CustomersIndexElasticsearch;
import jp.co.softbrain.esales.elasticsearch.ElasticsearchOperationUtil;

/**
 * Elasticsearch connect config
 */
@Configuration
public class ElasticsearchConfiguration {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchConfiguration.class);

    private static final String HTTP_SCHEMA_NAME = "http";
    private static final String HTTPS_SCHEMA_NAME = "https";

    @Value("${elasticsearch.host}")
    private String host = "localhost";

    @Value("${elasticsearch.port}")
    private int port = 9200;

    @Value("${elasticsearch.ssl}")
    private boolean isSsl = false;

    @Value("${elasticsearch.username}")
    private String userName;

    @Value("${elasticsearch.password}")
    private String password;

    private String httpSchema = HTTP_SCHEMA_NAME;

    /**
     * Create RestHighLevelClient bean
     *
     * @return
     */
    @Bean(destroyMethod = "close")
    public RestHighLevelClient restClient() {
        if (isSsl || port == 443) {
            httpSchema = HTTPS_SCHEMA_NAME;
        }
        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, httpSchema));
        if (StringUtils.isNotEmpty(userName)) {
            final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(userName, password));
        }

        builder.setFailureListener(new RestClient.FailureListener() {

            @Override
            public void onFailure(org.elasticsearch.client.Node node) {
                log.warn(
                        "Elasticsearch connect failure !!!! FailureListener HAS WOKEN UP!!!! CREATYE A FAILURE LISTENER BEAN");
            }
        });

        return new RestHighLevelClient(builder);
    }

    /**
     * Register bean ElasticsearchOperationUtil
     *
     * @return ElasticsearchOperationUtil
     */
    @Bean
    public ElasticsearchOperationUtil elasticsearchOperationUtil() {
        return new ElasticsearchOperationUtil(restClient());
    }

    /**
     * Register bean EmployeeIndexElasticsearch
     *
     * @return EmployeeIndexElasticsearch
     */
    @Bean
    public CustomersIndexElasticsearch customerIndexElasticsearch() {
        return new CustomersIndexElasticsearch(elasticsearchOperationUtil());
    }
}
