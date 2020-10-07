package jp.co.softbrain.esales.tenants.service.mapper;

import jp.co.softbrain.esales.tenants.domain.StoragesManagement;
import jp.co.softbrain.esales.tenants.service.dto.StoragesManagementDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link StoragesManagement} and its DTO {@link StoragesManagementDTO}.
 *
 * @author nguyenvietloi
 */
@Mapper(componentModel = "spring", uses = {})
public interface StoragesManagementMapper extends EntityMapper<StoragesManagementDTO, StoragesManagement> {
}
