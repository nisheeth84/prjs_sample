package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.MPackages;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;

/**
 * Repository interface for {@link MPackages}
 *
 * @author tongminhcuong
 */
@Repository
@XRayEnabled
public interface MPackagesRepositoryCustom {

    /**
     * Get all {@link MPackages} with specified package_id list
     *
     * @param packageIds List of package_id
     * @return List of {@link PackagesDTO}
     */
    List<PackagesDTO> getPackages(List<Long> packageIds);
    
    /**
     * Get all master packages
     * @param packageIds List id packages
     * @return List {@link GetMasterPackagesDataDTO}
     */
    List<GetMasterPackagesDataDTO> getMasterPackages(List<Long> packageIds);
}
