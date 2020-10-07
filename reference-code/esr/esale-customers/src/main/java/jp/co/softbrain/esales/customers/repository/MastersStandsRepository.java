package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.MastersStands;

/**
 * Spring Data repository for the MastersStands entity.
 *
 * @author TuanLV
 */
@Repository
@XRayEnabled
public interface MastersStandsRepository extends JpaRepository<MastersStands, Long> {

    /**
     * findAll MastersMotivations
     *
     * @param sort ASC
     * @return List<MastersMotivations>
     */
    List<MastersStands> findAllByOrderByDisplayOrderAsc();

    /**
     * delete By Master Stand Id In
     *
     * @param masterStandIds : list master stands id for delete
     */
    @Modifying(clearAutomatically = true)
    void deleteByMasterStandIdIn(List<Long> masterStandIds);

    /**
     * find Masters Stands Id For Delete
     *
     * @param masterStandIds : List master stands id for delete
     * @return List master stands id
     */
    @Query(value = "SELECT " + "     mst.master_stand_id " + "FROM masters_stands mst "
            + "WHERE mst.master_stand_id IN (:masterStandIds)", nativeQuery = true)
    List<Long> findMastersStandsIdForDelete(@Param("masterStandIds") List<Long> masterStandIds);

    /**
     * Get all mastersStands with given is_available
     *
     * @param is_available the condition
     * @return list entity
     */
    List<MastersStands> findByIsAvailable(Boolean isAvailable);

    /**
     * find one
     * @param masterStandId
     * @return
     */
    Optional<MastersStands> findByMasterStandId(Long masterStandId);

    /**
     * delete by masterStandId
     * 
     * @param masterStandId
     */
    @Modifying(clearAutomatically = true)
    void deleteByMasterStandId(Long masterStandId);
}
