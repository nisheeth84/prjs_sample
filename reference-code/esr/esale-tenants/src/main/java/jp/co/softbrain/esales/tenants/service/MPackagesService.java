package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetMasterPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetPackagesDataDTO;

/**
 * Service interface for packages services.
 *
 * @author lehuuhoa
 */
@XRayEnabled
public interface MPackagesService {

	/**
	 * Get the package names.
	 * 
	 * @param packageIds : list package Id param
	 * @return list {@see GetPackagesDataDTO}
	 */
	List<GetPackagesDataDTO> getPackageNames(List<Long> packageIds);
	
	/**
	 * Get all the information about master packages.
	 * @param packageIds List id packages
	 * @return {@link GetMasterPackagesDataDTO}
	 */
	List<GetMasterPackagesDataDTO> getMasterPackages(List<Long> packageIds);
}
