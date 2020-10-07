package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.FieldInfoItem;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemLabelDTO;

/**
 * Spring Data repository for the FieldInfoItem entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoItemRepository extends JpaRepository<FieldInfoItem, Long> {

    /**
     * find FieldInfoItem by itemId
     * @param itemId data need for find
     * @return data after find
     */
    Optional <FieldInfoItem> findByItemId(Long itemId);

    /**
     * get list FieldInfoItem by fieldIdReflect
     *
     * @param fieldId id need for get
     * @return List record in database
     */
    List<FieldInfoItem> findByFieldId(Long fieldId);

    /**
     * get list FieldInfoItem by fieldIdReflect
     *
     * @param fieldIdReflect id need for get
     * @return List record in database
     */
    @Query(value = "SELECT * "
                 + "FROM field_info_item "
                 + "WHERE field_id IN (:fieldIdReflects)", nativeQuery = true)
    List<FieldInfoItem> getListFieldInfoItemLookUp(@Param("fieldIdReflects") List<Long> fieldIdReflects);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM field_info_item "
                 + "WHERE field_id IN (:deletedFields)", nativeQuery = true)
    void deleteByFieldIds(@Param("deletedFields") List<Long> deletedFields);

    /**
     * get ItemId from table field_info_item by fieldId
     *
     * @param fieldId : data need for get
     * @return list itemId after get
     */
    @Query(value = "SELECT field_info_item.item_id "
                 + "FROM field_info_item "
                 + "WHERE field_info_item.field_id = :fieldId ", nativeQuery = true)
    List<Long> getItemIdByFieldId(@Param("fieldId") Long fieldId);

    /**
     * get all field info item by field belong
     *
     * @param fieldBelong
     * @return
     */
    @Query(value = "SELECT new jp.co.softbrain.esales.commons.service.dto.FieldInfoItemLabelDTO("
            + " fii.itemId, fi.fieldId, fi.fieldName, fii.itemLabel)"
            + " FROM FieldInfo fi"
            + " INNER JOIN FieldInfoItem fii ON fii.fieldId = fi.fieldId"
            + " WHERE fi.fieldBelong = :fieldBelong")
    List<FieldInfoItemLabelDTO> findFieldInfoItemByFieldBelong(@Param("fieldBelong") Integer fieldBelong);

    /**
     * find All By FieldId And IsAvailable Is True
     * 
     * @param fieldId
     * @return List<FieldInfoItem>
     */
    List<FieldInfoItem> findAllByFieldIdAndIsAvailableIsTrue(Long fieldId);

    /**
     * get field name 
     * @param deletedFields data need for get
     * @return
     */
    @Query(value = "SELECT field_info.field_name "
                 + "FROM field_info "
                 + "WHERE field_info.field_id IN (:deletedFields) " 
                 + "ANd field_info.field_type = 5", nativeQuery = true)
    List<String> getNumbericByFieldId(@Param("deletedFields") List<Long> deletedFields);
}
