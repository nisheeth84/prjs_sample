package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.repository.ServiceOrderRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.GetResultServiceOrderDTO;

/**
 * The repository custom implement of ServiceOrder
 * 
 * @author ThaiVV
 */
@Repository
public class ServiceOrderRepositoryCustomImpl extends RepositoryCustomUtils implements ServiceOrderRepositoryCustom {

    /**
     * @see jp.co.softbrain.esales.commons.repository
     *      ServiceOrderRepositoryCustom#findByEmployeeIdAndServiceId(Long,
     *      List<Long>)
     */
    @Override
    public List<GetResultServiceOrderDTO> findByEmployeeIdAndServiceId(Long employeeId, List<Long> serviceId) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> parameter = new HashMap<>();
        sql.append("SELECT menu.employee_id, ");
        sql.append("       menu.service_id, ");
        sql.append("       menu.service_name, ");
        sql.append("       menu.service_order, ");
        sql.append("       menu.updated_date ");
        sql.append("FROM menu_service_order menu ");
        sql.append("WHERE menu.employee_id = :employeeId ");
        parameter.put("employeeId", employeeId);
        if (serviceId != null && !serviceId.isEmpty()) {
            sql.append("AND menu.service_id IN :serviceId ");
            parameter.put("serviceId", serviceId);
        }
        sql.append("ORDER BY menu.service_order ASC");

        return this.getResultList(sql.toString(), "getResultServiceOrder", parameter);
    }
}
