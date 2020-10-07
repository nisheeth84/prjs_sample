package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Map;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemLabelDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataOutDTO;
import jp.co.softbrain.esales.commons.service.dto.LookupDataDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn1DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn2DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn3DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutOutDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateFieldInfoPersonalInDTO;

/**
 * Service Interface for field info
 *
 */
@XRayEnabled
public interface CommonFieldInfoService {

    /**
     * Get field info personal which matched some conditions
     *
     * @param searchConditions search conditions
     * @return List information personal field
     */
    public List<FieldInfoPersonalsOutDTO> getFieldInfoPersonals(FieldInfoPersonalsInputDTO searchConditions);

    /**
     * Get information custom fields
     *
     * @param fieldBelong functions used field_info
     * @return List information custom field
     */
    public List<CustomFieldsInfoOutDTO> getCustomFieldsInfo(Integer fieldBelong);

	/**
	 * update Field Info personal
	 *
	 * @param extentionBelong    Screen code uses field
	 * @param fieldBelong        Functional code uses field
	 * @param selectedTargetType Functional code uses field
	 * @param selectedTargetId   Functional code uses field
	 * @param fieldInfos         Array contains field information
	 * @return List id of the update Field Info personal
	 */
	public List<Long> updateFieldInfoPersonals(Integer fieldBelong, Integer extentionBelong, Integer selectedTargetType,
			Long selectedTargetId, List<UpdateFieldInfoPersonalInDTO> updateInfoList);

    /**
     * update Detail Screen Layout
     *
     * @param fieldBelong the field belong
     * @param deleteFields the list field delete
     * @param fields the list fields
     * @param deleteTabs the list tab delete
     * @param tabs the list tab
     * @param deleteFieldsTab the list fieldsTab delete
     * @param fieldsTab the list fieldsTab
     * @return the UpdateDetailScreenLayoutOutDTO
     */
    public UpdateDetailScreenLayoutOutDTO updateDetailScreenLayout(Integer fieldBelong, List<Long> deleteFields,
            List<UpdateDetailScreenLayoutIn1DTO> fields, List<Long> deleteTabs,
            List<UpdateDetailScreenLayoutIn2DTO> tabs, List<Long> deleteFieldsTab,
            List<UpdateDetailScreenLayoutIn3DTO> fieldsTab);
    
    /**
     * set data for node lookupData
     * 
     * @param lookupDataRtnMap map contain list of lookupData
     * @param itemReflectLabelMap Map contain fields labels
     * @param e object contain a custom field info
     * @param c object contain all fields Info
     */
    public LookupDataDTO getLookupData(Map<Long, String> itemReflectLabelMap, ObjectMapper mapper, String lookupDataString);
    
    /**
     * get all Fields by fieldBelong
     * 
     * @param fieldBelong
     */
    public List<FieldInfoItemLabelDTO >getFieldInfoItemByFieldBelong(Integer fieldBelong);
    
    /**
     * Get information custom fields by list fieldId
     * @param fieldIds data need for get Field data
     * @return List information custom field
     */
    public List<CustomFieldsInfoOutDTO> getCustomFieldsInfoByFieldIds(List<Long> fieldIds);

    /**
     * get data relation 
     * @param fieldBelong data need for get data
     * @param listIds data need for get data
     * @param fieldIds data need for get data
     * @return data relation
     */
    public GetRelationDataOutDTO getRelationData(Integer fieldBelong, List<Long> listIds, List<Long> fieldIds);
}
