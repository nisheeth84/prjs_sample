package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.customers.domain.MastersScenariosDetails;

/**
 * Spring Data repository for the MastersScenariosDetails entity.
 *
 * @author huandv
 */
@Repository
public interface MastersScenariosDetailsRepository extends JpaRepository<MastersScenariosDetails, Long> {

    /**
     * deleteByScenarioIdAndScenarioDetailId : delete By Scenario Id And
     * Scenario Detail Id
     *
     * @param scenarioId : scenario Id
     * @param deletedMilestones : deleted Milestones
     */
    @Modifying(clearAutomatically = true)
    void deleteByScenarioIdAndScenarioDetailId(Long scenarioId, List<Long> deletedMilestones);

    /**
     * Delete By Scenario Id In
     * @param scenariosId
     */
    @Modifying(clearAutomatically = true)
    void deleteByScenarioId(Long scenariosId);

    /**
     * findByScenarioDetailId : get the entity by id
     * @param scenarioDetailId : scenario detail id
     * @return MastersScenariosDetails : the entity
     */
    Optional<MastersScenariosDetails> findByScenarioDetailId(Long scenarioDetailId);

    /**
     * Delete by scenarioDetailId
     * 
     * @param scenarioDetailId
     */
    @Modifying(clearAutomatically = true)
    void deleteByScenarioDetailId(Long scenarioDetailId);
}
