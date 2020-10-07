package jp.co.softbrain.esales.tenants.service.mapper;

import jp.co.softbrain.esales.tenants.domain.PaymentsManagement;
import jp.co.softbrain.esales.tenants.service.dto.PaymentsManagementDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link PaymentsManagement} and its DTO {@link PaymentsManagementDTO}.
 *
 * @author nguyenvietloi
 */
@Mapper(componentModel = "spring", uses = {})
public interface PaymentsManagementMapper extends EntityMapper<PaymentsManagementDTO, PaymentsManagement> {
}
