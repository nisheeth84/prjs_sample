package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.ImportSetting;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingDTO;

/**
 * @author dohuyhai
 * Mapper for the entity {@link ImportSetting} and its DTO {@link ImportSettingDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ImportSettingMapper extends EntityMapper<ImportSettingDTO, ImportSetting> {



    default ImportSetting fromId(Long importSettingId) {
        if (importSettingId == null) {
            return null;
        }
        ImportSetting importSetting = new ImportSetting();
        importSetting.setImportId(importSettingId);
        return importSetting;
    }
}
