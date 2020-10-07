package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingGetDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportSettingRequest;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.ImportSetting}.
 */
@XRayEnabled
public interface ImportSettingService {

    /**
     * Save a ImportSetting.
     *
     * @param ImportSettingDTO the entity to save.
     * @return the persisted entity.
     */
    ImportSettingDTO save(ImportSettingDTO dto);

    /**
     * get Import Setting in DB 
     * @param req
     * @return entity
     */
    ImportSettingGetDTO getImportSetting(GetImportSettingRequest req);
}
