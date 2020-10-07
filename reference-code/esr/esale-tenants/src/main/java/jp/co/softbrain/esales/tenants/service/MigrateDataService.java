package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.MigrateDataResult;

/**
 * Service interface for managing Migration data process
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface MigrateDataService {

    /**
     * Migration data for specified micro service
     *
     * @param microServiceName The name of micro service
     * @return object contains information after migrate
     */
    List<MigrateDataResult> migrateData(String microServiceName);
}
