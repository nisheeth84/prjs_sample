package jp.co.softbrain.esales.customers.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenarioResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosResponseDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MastersScenariosRepositoryCustom
 *
 * @author buithingocanh
 */
@XRayEnabled
@Repository
public interface MastersScenariosRepositoryCustom {

    /**
     * get Master Scenarios
     * @return list GetMasterScenariosResponseDTO
     */
    List<GetMasterScenariosResponseDTO> getMasterScenarios();

    /**
     * get Master Scenario
     * @param scenarioId : scenario id
     * @return list GetMasterScenariosResponseDTO
     */
    List<GetMasterScenarioResponseDTO> getMasterScenario(Long scenarioId);
}
