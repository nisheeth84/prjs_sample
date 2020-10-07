package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.MastersMotivations;

/**
 * Spring Data repository for the MastersMotivations entity
 *
 * @author phamminhphu
 *
 */
@Repository
@XRayEnabled
public interface MastersMotivationsRepository extends JpaRepository<MastersMotivations, Long> {

    /**
     * Get all MastersMotivations with given is_available
     *
     * @param isAvailable the condition
     * @return list entity
     */
    List<MastersMotivations> findByIsAvailable(Boolean isAvailable);


    /**
     * findIconPath
     *
     * @param masterMotavition
     * @return List String
     */
    @Query(value = "SELECT ms.icon_path "
                 + "FROM masters_motivations ms "
                 + "WHERE ms.master_motivation_id IN (:masterMotavition) "
                 + "  AND ms.icon_type = 0", nativeQuery = true)
    List<String> findIconPath(@Param("masterMotavition") List<Long> masterMotavition);

    /**
     * find List Id For Delete
     *
     * @param masterMotivationId :
     * @return
     */
    @Query(value = "SELECT ms.master_motivation_id "
                 + "FROM masters_motivations ms "
                 + "WHERE ms.master_motivation_id IN (:masterMotivationId)", nativeQuery = true)
    List<Long> findListIdForDelete(@Param("masterMotivationId") List<Long> masterMotivationId);

    /**
     * findAll MastersMotivations
     *
     * @param sort ASC
     * @return List<MastersMotivations>
     */
    List<MastersMotivations> findAllByOrderByDisplayOrderAsc();

    /**
     * find Icon Path For Delete
     *
     * @param masterMotivation : master motivation id for select
     * @return String
     */
    @Query(value = "SELECT " + "     ms.icon_path " + "FROM masters_motivations ms "
            + "WHERE ms.master_motivation_id = :masterMotivationId", nativeQuery = true)
    String findIconPathForDelete(@Param("masterMotivationId") Long masterMotivationId);

    /**
     * delete By Master Motivation Id In
     *
     * @param mastermotivationIds
     */
    @Modifying(clearAutomatically = true)
    void deleteByMasterMotivationIdIn(List<Long> mastermotivationIds);

    /**
     * find one by id
     * @param masterMotivationId
     * @return
     */
    Optional<MastersMotivations> findByMasterMotivationId(Long masterMotivationId);
    
    /**
     * findIconName
     * 
     * @param masterMotivationId
     * @return String
     */
    @Query(value = "SELECT " + "     ms.icon_name " + "FROM masters_motivations ms "
            + "WHERE ms.master_motivation_id = :masterMotivationId", nativeQuery = true)
    String findIconName(@Param("masterMotivationId") Long masterMotivationId);

    /**
     * Delete masterMotivationId
     * 
     * @param masterMotivationId
     *            masterMotivationId
     */
    @Modifying(clearAutomatically = true)
    void deleteByMasterMotivationId(Long masterMotivationId);
}
