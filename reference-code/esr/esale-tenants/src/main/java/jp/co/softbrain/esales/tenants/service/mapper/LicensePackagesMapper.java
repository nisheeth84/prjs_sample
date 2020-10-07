package jp.co.softbrain.esales.tenants.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.tenants.domain.LicensePackages;
import jp.co.softbrain.esales.tenants.service.dto.LicensePackagesDTO;

/**
 * Mapper for the entity {@link LicensePackages} ans its DTO
 * {@link LicensePackagesDTO}
 *
 * @author tongminhcuong
 */
@Mapper(componentModel = "spring", uses = {})
public interface LicensePackagesMapper extends EntityMapper<LicensePackagesDTO, LicensePackages> {

}
