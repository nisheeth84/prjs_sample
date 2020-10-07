package jp.co.softbrain.esales.tenants.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.tenants.domain.Tenants;
import jp.co.softbrain.esales.tenants.service.dto.TenantReceiveServicesDTO;

/**
 * Mapper for the entity {@link Tenants} and its DTO {@link TenantReceiveServicesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TenantsMapper extends EntityMapper<TenantReceiveServicesDTO, Tenants> {
}
