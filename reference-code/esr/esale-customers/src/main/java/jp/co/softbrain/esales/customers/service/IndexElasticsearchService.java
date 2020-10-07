package jp.co.softbrain.esales.customers.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * IndexElasticsearchService interface
 */
@XRayEnabled
public interface IndexElasticsearchService {

    /**
     * Indexing elasticsearch when create, update customer
     *
     * @param customerIdList
     *            customer id
     */
    void putIndexElasticsearch(List<Long> customerIdList);

    /**
     * Indexing elasticsearch when delete customer
     *
     * @param customerIdList
     *            list of customer
     */
    void deleteIndexElasticsearch(List<Long> customerIdList);
}
