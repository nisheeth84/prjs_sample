package jp.co.softbrain.esales.commons.service;

import java.io.IOException;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.SelectDetailElasticSearchInDTO;
import jp.co.softbrain.esales.commons.service.dto.SelectDetailElasticSearchOutDTO;

/**
 * Service elasticSearch Interface for communicate with ElasticSearch
 */
@XRayEnabled
public interface ElasticSearchService {

    /**
     * get detail from Elasticsearch by condition
     *
     * @see SelectDetailElasticSearchInDTO
     * @param inputDto
     * @return
     * @throws Exception
     */
    SelectDetailElasticSearchOutDTO getDetailElasticSearch(SelectDetailElasticSearchInDTO inputDto) throws IOException;
}
