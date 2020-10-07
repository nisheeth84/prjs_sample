package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.service.dto.GetImportMatchingKeyDTO;

/**
 * Spring Data repository for the FieldInfo entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoRepository extends JpaRepository<FieldInfo, Long> {
    /**
     * find list field info by field belong
     *
     * @param fieldBelong - field belong
     * @return list FieldInfo
     */
    List<FieldInfo> findByFieldBelong(Integer fieldBelong);

    Optional<FieldInfo> findByFieldId(Long fieldId);
    
    /**
     * get Label CodeBy list FieldId
     *
     * @param fieldIdsInCondition - list field id input
     * @return list label code
     */
    @Query(value = "SELECT fi.label_code "
                 + "FROM field_info fi "
                 + "LEFT JOIN field_info_item fii "
                 + "       ON fi.field_id = fii.field_id "
                 + "WHERE fi.field_id IN (:fieldIdsInCondition)", nativeQuery = true)
    List<String> getLabelCodeByFieldIds(@Param("fieldIdsInCondition") String fieldIdsInCondition);

    /**
     * get FieldInfoDTO in database by fieldIdReflect
     *
     * @param fieldIdReflect id need for get
     * @return record in database
     */
    @Query(value = "SELECT field_info.* "
                 + "FROM field_info "
                 + "LEFT JOIN field_info_item "
                 + "       ON field_info.field_id = field_info_item.field_id "
                 + "WHERE field_info.field_id = :fieldIdReflect", nativeQuery = true)
    List<FieldInfo> getFieldInfoLookUp(@Param("fieldIdReflect") Long fieldIdReflect);

    /**
     * get max value field_order function Activity
     *
     * @param fieldBelong
     * @return max value of field_order
     */
    @Query(value = "SELECT MAX ( field_info.field_order ) "
                 + "FROM field_info  "
                 + "WHERE field_info.field_belong = :fieldBelong ", nativeQuery = true)
    Integer getMaxFieldOrderActivity(@Param("fieldBelong") Integer fieldBelong);

    /**
     * get max value field_order by fieldbelong and fieldType
     *
     * @param fieldBelong
     * @param fieldType
     * @return max value of field_order
     */
    @Query(value = "SELECT MAX ( field_info.field_order ) "
                 + "FROM field_info  "
                 + "WHERE field_info.field_belong = :fieldBelong AND field_info.field_type = :fieldType ", nativeQuery = true)
    Integer getMaxFieldOrder(@Param("fieldBelong") Integer fieldBelong, @Param("fieldType") Integer fieldType);

    /**
     * get field_name by fieldBelong, fieldType
     *
     * @param fieldBelong data need for get
     * @param fieldType data need for get
     * @return string after get
     */
    @Query(value = "SELECT field_info.field_name "
                 + "FROM field_info "
                 + "WHERE field_info.field_belong = :fieldBelong "
                 + "  AND field_info.field_type = :fieldType "
                 + "  AND field_info.is_default = false "
                 + "ORDER BY field_info.field_name DESC", nativeQuery = true)
    List<String> getFieldName(@Param("fieldBelong") Integer fieldBelong, @Param("fieldType") Integer fieldType);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM field_info "
                 + "WHERE field_id IN (:deletedFields)", nativeQuery = true)
    void deleteByFieldIds(@Param("deletedFields") List<Long> deletedFields);

    @Query(value = "SELECT CAST(field_info.relation_data->'field_id' AS TEXT) " + "FROM field_info "
            + "WHERE field_info.field_type = :fieldType "
            + "AND field_info.field_id IN (:deletedFields)", nativeQuery = true)
    List<String> getRelationDataIdsByDeletedFields(@Param("fieldType") Integer fieldType,
            @Param("deletedFields") List<Long> deletedFields);

    /**
     * find employees by employeeIds
     *
     * @param employeeIds
     * @return
     */
    @Query("SELECT fi.fieldName FROM FieldInfo fi WHERE fi.fieldId IN :fieldIds")
    List<String> findFieldNameAllWithFieldIds(@Param("fieldIds") List<Long> fieldIds);

    /**
     * get field_name by fieldBelong, fieldType
     *
     * @param fieldBelong data need for get
     * @param fieldType data need for get
     * @return string after get
     */
    @Query(value = "SELECT fir.field_name, fir.field_type, fir.field_belong FROM field_info fi "
            + " INNER JOIN field_info fir ON (fi.relation_data->'display_field_id')\\:\\:int8 = fir.field_id "
            + " WHERE fi.field_type= 17 AND fi.field_name = :fieldName "
            + "     AND fir.field_belong = (fi.relation_data->'field_belong')\\:\\:int8", nativeQuery = true)
    List<FieldInfo> getRealationDataByFieldName(@Param("fieldName") String fieldName);

    @Modifying
    @Query(value = "SELECT e from FieldInfo e "
        + "WHERE e.fieldBelong = :fieldBelong "
        + "AND e.fieldType NOT IN (11, 16,19,20,21) "
        + "AND (e.availableFlag is null or e.availableFlag <> 0 )"
        + "ORDER BY e.fieldOrder ASC")
    List<FieldInfo> getTemplateFieldsInfoByFieldBelong(@Param("fieldBelong") Integer fieldBelong);

    @Query(value = "select fir.* from field_info fi "
        + "inner join field_info fir on (fi.relation_data->>'field_belong')\\:\\:int8 = fir.field_belong "
        + "where fi.field_id = :fieldId "
        + "and fir.field_type=9 "
        + "and fir.available_flag=3", nativeQuery = true)
    List<FieldInfo> getFieldRelationItemsByFieldId(@Param("fieldId") Long fieldId);


    /**
     * get Field Option Item
     * 
     * @param fieldBelong
     * @return List<FieldInfo>
     */
    @Query(value = "SELECT e FROM FieldInfo e "
        + "         WHERE e.fieldBelong = :fieldBelong "
        + "               AND e.availableFlag = 3")
    List<FieldInfo> getFieldOptionsItemByFieldBelong(@Param("fieldBelong") Integer fieldBelong);
    
    /**
     * get MatchingItemsByFieldBelong
     * 
     * @param fieldBelong
     * @return List<GetImportMatchingKeyDTO>
     */
    @Query(value = "SELECT new jp.co.softbrain.esales.commons.service.dto.GetImportMatchingKeyDTO(e.fieldName,e.fieldLabel) "
            + " FROM FieldInfo AS e "
            + " WHERE e.fieldBelong = :fieldBelong "
            + "      AND e.fieldType = 9 "
            + "      AND (e.availableFlag IS NULL OR e.availableFlag <> 0) "
            + "      AND e.isDefault = false ")
    List<GetImportMatchingKeyDTO> getMatchingItemsByFieldBelong(@Param("fieldBelong") Integer fieldBelong);
    
    /**
     * get field Id from table field_info by FieldId
     *
     * @param fieldId : data need for get
     * @return list field Id after get
     */
    @Query(value = "SELECT lookup_data->>'item_reflect' "
                 + "FROM field_info "
                 + "WHERE (lookup_data->'item_reflect')\\:\\:TEXT LIKE :stringFieldId ", nativeQuery = true)
    List<String> getItemReflectByLookupFieldId(@Param("stringFieldId") String stringFieldId);
}
