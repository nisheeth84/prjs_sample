package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoInDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoOutDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.FieldInfo}.
 */
@XRayEnabled
public interface FieldInfoService {

    /**
     * Save a fieldInfo.
     *
     * @param fieldInfoDTO the entity to save.
     * @return the persisted entity.
     */
    FieldInfoDTO save(FieldInfoDTO fieldInfoDTO);

    /**
     * Get all the fieldInfos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FieldInfoDTO> findAll(Pageable pageable);

    /**
     * Get the "id" fieldInfo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FieldInfoDTO> findOne(Long id);

    /**
     * Delete the "id" fieldInfo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Update custom field info
     *
     * @param fieldBelong : data need for Update custom field info
     * @param deletedFields : data need for Update custom field info
     * @param fields : data need for Update custom field info
     * @param fieldsTab : data need for Update custom field info
     * @param deletedFieldsTab : data need for Update custom field info
     * @param tabs : data need for Update custom field info
     * @return UpdateCustomFieldsInfoOutDTO : List id of the updated record
     */
    UpdateCustomFieldsInfoOutDTO updateCustomFieldsInfo(Integer fieldBelong, List<Long> deletedFields,
            List<UpdateCustomFieldsInfoInDTO> fields, List<TabsInfoDTO> tabs, List<Long> deletedFieldsTab,
            List<FieldInfoTabDTO> fieldsTab);

    /**
     * Service for APi getFieldsInfo
     *
     * @param fieldBelong fieldBelong of Fields Info to get
     * @param fieldType fieldType of Fields Info to get
     * @param fieldId fieldId of Fields Info to get
     * @return list of fields Info from search condition
     */
    List<FieldsInfoOutDTO> getFieldsInfo(Integer fieldBelong, Integer fieldType, Long fieldId);
}
