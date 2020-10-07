package jp.co.softbrain.esales.employees.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.elasticsearch.EmployeeIndexElasticsearch;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.IndexElasticsearchService;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;

/**
 * ElasticsearchService
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class IndexElasticsearchServiceImpl implements IndexElasticsearchService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmployeeIndexElasticsearch employeeIndexElasticsearch;

    @Autowired
    private EmployeesCommonService employeesCommonService;

    /**
     * @see IndexElasticsearchService#putIndexElasticsearch(List)
     */
    @Transactional
    public void putIndexElasticsearch(List<Long> employeeIdList) {
        List<EmployeeElasticsearchDTO> dataSyncElasticSearch =
            employeesCommonService.getDataSyncElasticSearch(employeeIdList);

        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        employeeIndexElasticsearch.putIndexElasticsearch(tenantName, dataSyncElasticSearch);

    }

    /**
     * @see IndexElasticsearchService#deleteIndexElasticsearch(List) (Long)
     */
    public void deleteIndexElasticsearch(List<Long> employeeIdList) {
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        employeeIndexElasticsearch.deleteIndexElasticsearch(tenantName, employeeIdList);
    }
}
