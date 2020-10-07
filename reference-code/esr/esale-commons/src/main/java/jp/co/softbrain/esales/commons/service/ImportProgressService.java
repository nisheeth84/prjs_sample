package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.ImportProgressDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportProgressBarRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportProgressRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportProgressBarResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportProgressResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.UpdateImportProgressResponse;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.ImportProgress}.
 */
@XRayEnabled
public interface ImportProgressService {

    /**
     * Save a Progress.
     *
     * @param ImportProgressDTO the entity to save.
     * @return the persisted entity.
     */
    ImportProgressDTO save(ImportProgressDTO dto);

    /**
     * get Import Progress in DB 
     * @param req
     * @return entity
     */
    GetImportProgressResponse getImportProgress(GetImportProgressRequest req);
    
    /**
     * update Import Progress in DB 
     * @param req
     * @return entity
     */
    UpdateImportProgressResponse updateImportProgress(ImportProgressDTO req);
    
    /**
     * get Import Progress Bar 
     * @param req
     * @return entity
     */
    GetImportProgressBarResponse getImportProgressBar(GetImportProgressBarRequest req);
}
