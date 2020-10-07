package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateElasticsearchIndexResult;

/**
 * SettingElasticsearchEnvironmentService
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface SettingElasticsearchEnvironmentService {

    /**
     * Create index elasticsearch for tenant target
     *
     * @param tenantName Name of tenant
     * @param microServiceNameList List micro service name
     * @return {@link CreateElasticsearchIndexResult}
     */
    CreateElasticsearchIndexResult createElasticsearchIndex(String tenantName, List<String> microServiceNameList);

    /**
     * Delete elasticsearch index
     *
     * @param index index
     */
    void deleteElasticsearchIndex(String index);
}
