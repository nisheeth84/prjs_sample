package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.Positions;

/**
 * PositionsRepository
 * Spring Data repository for the Positions entity.
 *
 * @author QuangLV
 * @see JpaRepository
 */
@Repository
@XRayEnabled
public interface PositionsRepository extends JpaRepository<Positions, Long> {
    /**
     * find position with condition is_available = true
     *
     * @return list position data
     */
    List<Positions> findAllByIsAvailableTrueOrderByPositionOrderAsc();

    /**
     * deletebyPositionId : delete Positions by list position id
     *
     * @param positionIds : list position id
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE  " +
                   "FROM Positions " +
                   "WHERE position_id IN (:positionIds) ", nativeQuery = true)
    void deletebyPositionId(@Param("positionIds") List<Long> positionIds);

    /**
     * findByPositionIdIn : get all record by positionIds
     *
     * @param positionIds : list position id
     * @return List<Positions> :
     */
    List<Positions> findByPositionIdIn(List<Long> positionIds);

    /**
     * Find one Positions by positions id
     * 
     * @param positionId id of Positions
     * @return the entity response
     */
    Positions findByPositionId(Long positionId);
}
