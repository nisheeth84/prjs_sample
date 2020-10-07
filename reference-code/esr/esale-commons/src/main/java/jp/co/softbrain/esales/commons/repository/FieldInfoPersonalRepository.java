package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.FieldInfoPersonal;

/**
 * Spring Data repository for the FieldInfoPersonal entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoPersonalRepository extends JpaRepository<FieldInfoPersonal, Long> {

    /**
     * Find by employee id and extension belong and fieldBelong
     *
     * @param employeeId id of employee
     * @param extensionBelong functions used field_info_personal
     * @param fieldBelong functions used field_info
     * @return list field personal
     */
    List<FieldInfoPersonal> findByEmployeeIdAndExtensionBelongAndFieldBelongAndSelectedTargetTypeAndSelectedTargetId(
            @Param("employeeId") Long employeeId, @Param("extensionBelong") Integer extensionBelong,
            @Param("fieldBelong") Integer fieldBelong,
            @Param("selectedTargetType") Integer selectedTargetType,
            @Param("selectedTargetId") Long selectedTargetId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM field_info_personal "
                 + "WHERE field_id IN (:deletedFields)", nativeQuery = true)
    void deleteByFieldIds(@Param("deletedFields") List<Long> deletedFields);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM field_info_personal "
                 + "WHERE relation_field_id IN (:deletedRelationFields)", nativeQuery = true)
    void deleteByRelationFieldIds(@Param("deletedRelationFields") List<Long> deletedRelationFields);
    
    Optional<FieldInfoPersonal> findByFieldInfoPersonalId(Long fieldInfoPersonalId);

    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE field_info_personal"
                 + "SET "
                 + "field_id = :fieldIdTo "
                 + "WHERE "
                 + "field_id = :fieldIdFrom", nativeQuery = true)
    void updateFieldId(@Param("fieldIdFrom") Long fieldIdFrom, @Param("fieldIdTo") Long fieldIdTo );
}
