package jp.co.softbrain.esales.tenants.elasticsearch.service;

/**
 * CreateElasticsearchIndexService
 *
 * @author luv-cuongtm
 */
public interface CreateElasticsearchIndexService {

    /**
     * Method process business logic for all batch
     *
     * @param tenantName
     * @param extensionBelong
     */
    void callServiceAsync(String tenantName, Long extensionBelong);
}
