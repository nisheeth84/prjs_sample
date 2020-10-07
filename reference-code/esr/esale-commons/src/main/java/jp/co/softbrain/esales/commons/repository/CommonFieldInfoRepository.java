package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoQueryDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoSubType2DTO;

/**
 * Spring Data repository for the Common FieldInfo entity.
 */
@Repository
@XRayEnabled
public interface CommonFieldInfoRepository {

    /**
     * Get field info personal which matched some conditions
     * 
     * @param searchConditions search conditions
     * @return List information personal field
     */
    public List<FieldInfoPersonalResponseDTO> getFieldInfoPersonals(FieldInfoPersonalsInputDTO searchConditions);

    /**
     * Count data by field id list
     * @param fieldIds list id of field
     * @return total field info personal
     */
    public Long countFieldInfoPersonalByFieldIds(List<Long> fieldIds);

    /**
     * Get information of key fields default
     *
     * @param extensionBelong -Id feature be used
     * @return GetImportInitInfoSubType2DTO - DTO for matchingKeys
     */
    public List<GetImportInitInfoSubType2DTO> getInfoDefaultFields(Long extensionBelong);

    /**
     * Get information for field with field_type text
     *
     * @param extensionBelong - Id feature be used
     * @return GetImportInitInfoSubType2DTO - DTO for matchingKeys
     */
    public List<GetImportInitInfoSubType2DTO> getInfoTextFields(Long extensionBelong);

    /**
     * Get information for field by parameter
     * 
     * @param fieldBelong fieldBelong of fieldsInfo to get
     * @param fieldType fieldType of fieldsInfo to get
     * @param fieldId fieldId of fieldsInfo to get
     * @return list of field Info matching search condition
     */
    public List<FieldsInfoQueryDTO> getFieldsInfoByFieldBelongTypeId(Integer fieldBelong, Integer fieldType, Long fieldId);
	
	/**
     * get list field of function
     * @param fieldBelong - is tabBelong
     * @return GetFieldInfoTabsSubType3DTO - field info
     */
    public List<GetFieldInfoTabsOutSubType3DTO> getListField(Integer fieldBelong);

    /**
     * get sequence for field type 
     * 
     * @param sequenceName
     * @return
     */
    public Long getSequenceForFieldName(String sequenceName);

    /**
     * Get custom field info
     * 
     * @param fieldBelong functions used field_info
     * @return List custom field
     */
    public List<CustomFieldsInfoResponseDTO> getCustomFieldsInfo(Integer fieldBelong, List<Long> fieldIds);

    /**
     * Count items that are Lookup data
     * @param deletedFields data need for count
     */
    public Integer countItemLookupData(List<Long> deletedFields);

    /**
     * Count item is key that are Lookup data
     * @param deletedFields  deletedFields data need for count
     */
    public Integer countKeyLookupData(List<Long> deletedFields);

    /**
     * Count items displayed on the List screen
     * @param deletedFields
     */
    public Integer countItemRelationList(List<Long> deletedFields);

    /**
     * count Calculator Items
     * @param listItemNumberic
     */
    public Integer countCalculatorItems(List<String> listItemNumberic);

    /**
     *  Count items displayed on the detail screen
     * @param deletedFields
     */
    public Integer countItemRelationDetail(List<Long> deletedFields);
    
    
}
