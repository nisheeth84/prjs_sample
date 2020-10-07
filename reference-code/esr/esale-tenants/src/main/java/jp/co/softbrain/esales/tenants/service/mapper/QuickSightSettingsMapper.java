package jp.co.softbrain.esales.tenants.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.tenants.domain.QuickSightSettings;
import jp.co.softbrain.esales.tenants.service.dto.QuickSightSettingsDTO;

/**
 * Mapper for the entity {@link QuickSightSettings} ans its DTO
 * {@link QuickSightSettingsDTO}
 *
 * @author tongminhcuong
 */
@Mapper(componentModel = "spring", uses = {})
public interface QuickSightSettingsMapper extends EntityMapper<QuickSightSettingsDTO, QuickSightSettings> {

}
