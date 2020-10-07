package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.FieldInfoTab;

/**
 * Spring Data repository for the FieldInfoTab entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoTabRepository extends JpaRepository<FieldInfoTab, Long> {

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM field_info_tab "
                 + "WHERE field_id IN (:deletedFields)", nativeQuery = true)
    void deleteByFieldIds(@Param("deletedFields") List<Long> deletedFields);
    
    /**
     *  find FieldInfoTab by fieldInfoTabId
     * @param fieldInfoTabId data need for find
     * @return data after find
     */
    Optional<FieldInfoTab> findByFieldInfoTabId(Long fieldInfoTabId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE field_info_tab"
                 + "SET "
                 + "field_id = :fieldIdTo "
                 + "WHERE "
                 + "field_id = :fieldIdFrom", nativeQuery = true)
    void updateFieldId(@Param("fieldIdFrom") Long fieldIdFrom, @Param("fieldIdTo") Long fieldIdTo );
}