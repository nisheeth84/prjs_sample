package jp.co.softbrain.esales.customers.repository.impl;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.customers.repository.MastersScenariosRepositoryCustom;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenarioResponseDTO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * MastersScenariosRepositoryCustomImpl
 *
 * @author buithingocanh
 */
@XRayEnabled
@Repository
public class MastersScenariosRepositoryCustomImpl extends RepositoryCustomUtils
        implements MastersScenariosRepositoryCustom {

    /**
     * @see jp.co.softbrain.esales.customers.repository.MastersScenariosRepositoryCustom#getMasterScenarios()
     */
    @Override
    public List<GetMasterScenariosResponseDTO> getMasterScenarios() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT   m.scenario_id");
        sqlBuilder.append("       , m.scenario_name");
        sqlBuilder.append("       , m.updated_date");
        sqlBuilder.append("       , d.scenario_detail_id");
        sqlBuilder.append("       , d.milestone_name");
        sqlBuilder.append("       , d.updated_date as updated_date_detail ");
        sqlBuilder.append("FROM masters_scenarios m ");
        sqlBuilder.append("LEFT JOIN masters_scenarios_details d ");
        sqlBuilder.append("ON m.scenario_id = d.scenario_id ");
        sqlBuilder.append("ORDER BY m.scenario_id ASC ");
        sqlBuilder.append("       , d.display_order ASC");

        return this.getResultList(sqlBuilder.toString(), "GetMasterScenariosMapper");
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.MastersScenariosRepositoryCustom#getMasterScenario(java.lang.Long)
     */
    @Override
    public List<GetMasterScenarioResponseDTO> getMasterScenario(Long scenarioId) {
        Map<String, Object> parameter = new HashMap<>();
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT   m.scenario_id");
        sqlBuilder.append("       , m.scenario_name");
        sqlBuilder.append("       , m.updated_date");
        sqlBuilder.append("       , d.scenario_detail_id");
        sqlBuilder.append("       , d.milestone_name");
        sqlBuilder.append("       , d.display_order");
        sqlBuilder.append("       , d.updated_date as updated_date_detail ");
        sqlBuilder.append("FROM masters_scenarios m ");
        sqlBuilder.append("LEFT JOIN masters_scenarios_details d ");
        sqlBuilder.append("ON m.scenario_id = d.scenario_id ");
        sqlBuilder.append("WHERE m.scenario_id = :scenarioId ");
        sqlBuilder.append("ORDER BY d.display_order ASC ");

        parameter.put("scenarioId", scenarioId);
        return this.getResultList(sqlBuilder.toString(),"GetMasterScenarioMapper", parameter);
    }


}
