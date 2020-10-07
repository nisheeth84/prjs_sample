package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;
import org.springframework.stereotype.Repository;

/**
 * Query for MIndustries interface
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MIndustriesRepositoryCustom {

    /**
     * Get info industry by name.
     *
     * @param industryTypeName name of industry type.
     * @return {@link IndustryDTO}
     */
    IndustryDTO getIndustry(String industryTypeName);
}
