package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.MastersScenarios;

/**
 * Repository for managed {@link MastersScenarios}
 */
@Repository
@XRayEnabled
public interface MastersScenariosRepository extends JpaRepository<MastersScenarios, Long> {

    /**
     * find data master scenario by scenarioId
     *
     * @param scenarioId - id scenario
     * @return list String
     */
    @Query(value = "SELECT mScenariosDetails.milestone_name "
        + "FROM masters_scenarios mScenarios "
        + "LEFT JOIN masters_scenarios_details mScenariosDetails "
        + "       ON mScenarios.scenario_id = mScenariosDetails.scenario_id "
        + "WHERE mScenarios.scenario_id = :scenarioId", nativeQuery = true)
    List<String> findDataMasterScenario(@Param("scenarioId") Long scenarioId);

    /**
     * delete MastersScenarios By list Id
     *
     * @param scenarioId list scenario Id
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE" + "     FROM masters_scenarios"
        + "     WHERE scenario_id IN( :scenarioId ) ", nativeQuery = true)
    void deleteByScenarioIdIs(@Param("scenarioId") List<Long> scenarioId);

    /**
     * Delete By Scenario Id In
     * @param scenariosId
     */
    @Modifying(clearAutomatically = true)
    void deleteByScenarioId(Long scenariosId);

    /**
     * findByScenarioId : get the entity
     * @param scenarioId : scenario id
     * @return MastersScenarios : the entity
     */
    Optional<MastersScenarios> findByScenarioId(Long scenarioId);
}
