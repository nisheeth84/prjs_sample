package jp.co.softbrain.esales.customers.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.repository.CustomersListCustomRepository;
import jp.co.softbrain.esales.customers.service.dto.GetInformationOfListDTO;

/**
 * CustomersListCustomRepositoryImpl
 *
 * @author lequyphuc
 */
@XRayEnabled
@Repository
public class CustomersListCustomRepositoryImpl extends RepositoryCustomUtils implements CustomersListCustomRepository {

    private static final String CUSTOMER_LIST_ID = "customerListId";

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListCustomRepository#getInformationOfList(java.lang.Long)
     */
    @Override
    public List<GetInformationOfListDTO> getInformationOfList(Long customerListId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT cl.is_auto_list");
        sqlBuilder.append("     , cl.is_over_write");
        sqlBuilder.append("     , clsc.customer_list_search_condition_id");
        sqlBuilder.append("     , clsc.field_id");
        sqlBuilder.append("     , clsc.search_type");
        sqlBuilder.append("     , clsc.search_option");
        sqlBuilder.append("     , clsc.search_value ");
        sqlBuilder.append("     , clsc.time_zone_offset ");
        sqlBuilder.append("FROM customers_list cl ");
        sqlBuilder.append("INNER JOIN customers_list_search_conditions clsc ");
        sqlBuilder.append("        ON cl.customer_list_id = clsc.customer_list_id ");
        sqlBuilder.append("WHERE cl.customer_list_id = :customerListId ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(CUSTOMER_LIST_ID, customerListId);
        return getResultList(sqlBuilder.toString(), "GetInformationOfListDTOMapping", parameters);
    }

}
