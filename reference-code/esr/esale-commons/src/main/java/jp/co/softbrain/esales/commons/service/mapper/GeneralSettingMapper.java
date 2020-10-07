package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.GeneralSetting;
import jp.co.softbrain.esales.commons.service.dto.GeneralSettingDTO;

/**
 * Mapper for the entity {@link GeneralSetting} and its dto
 * {@link GeneralSettingDTO}
 * 
 * @author phamminhphu
 */
@Mapper(componentModel = "spring", uses = {})
public interface GeneralSettingMapper extends EntityMapper<GeneralSettingDTO, GeneralSetting> {

    default GeneralSetting fromId(Long generalSettingId) {
        if (generalSettingId == null) {
            return null;
        }
        GeneralSetting generalSetting = new GeneralSetting();
        generalSetting.setGeneralSettingId(generalSettingId);
        return generalSetting;
    }
}
