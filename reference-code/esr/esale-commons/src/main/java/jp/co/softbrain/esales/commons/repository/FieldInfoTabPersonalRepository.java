package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.FieldInfoTabPersonal;

/**
 * Spring Data repository for the FieldInfoTabPersonal entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoTabPersonalRepository extends JpaRepository<FieldInfoTabPersonal, Long> {

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM field_info_tab_personal "
                 + "WHERE field_info_tab_id IN (SELECT field_info_tab_id FROM field_info_tab WHERE field_id IN (:deletedFields))", nativeQuery = true)
    void deleteByFieldIds(@Param("deletedFields") List<Long> deletedFields);
    
    /**
     * find a FieldInfoTabPersonal by fieldInfoTabPersonalId
     * @param fieldInfoTabPersonalId data need for find
     * @return data after find
     */
    Optional<FieldInfoTabPersonal> findByFieldInfoTabPersonalId(Long fieldInfoTabPersonalId);
    
}
