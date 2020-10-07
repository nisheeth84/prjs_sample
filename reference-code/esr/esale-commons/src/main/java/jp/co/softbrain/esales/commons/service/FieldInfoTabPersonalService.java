package jp.co.softbrain.esales.commons.service;

import java.time.Instant;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabPersonalDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.FieldInfoTabPersonal}.
 *
 * @author chungochai
 */
@XRayEnabled
public interface FieldInfoTabPersonalService {

    /**
     * Save a FieldInfoTabPersonal
     *
     * @param fieldInfoTabPersonalId the entity to save.
     * @return the persisted entity.
     */
    FieldInfoTabPersonalDTO save(FieldInfoTabPersonalDTO fieldInfoTabPersonalDTO);

    /**
     * findOne a FieldInfoTabPersonalDTO by id
     *
     * @param fieldInfoTabPersonalId find by fieldInfoTabPersonalId
     * @return the persisted entity.
     */
    Optional<FieldInfoTabPersonalDTO> findByFieldInfoTabPersonalId(Long id);

    /**
     * update data table field_info_tab_Personal
     *
     * @param fieldInfoTabPersonalId data need for update
     * @param fieldInfoTabId  data need for update
     * @param isColumnFixed  data need for update
     * @param columnWidth  data need for update
     * @return updated id
     */
    public Long updateFieldInfoTabPersonal(Long fieldInfoTabPersonalId,
            Long fieldInfoTabId, boolean isColumnFixed, Integer columnWidth, Instant updatedDate);

}
