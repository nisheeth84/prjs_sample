package jp.co.softbrain.esales.employees.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * IndexElasticsearchService interface
 */
@XRayEnabled
public interface IndexElasticsearchService {

    /**
     * Indexing elasticsearch when create, update Employee
     *
     * @param employeeIdList employee id
     */
    void putIndexElasticsearch(List<Long> employeeIdList);

    /**
     * Indexing elasticsearch when delete Employee
     *
     * @param employeeIdList list of employee
     */
    void deleteIndexElasticsearch(List<Long> employeeIdList);
}
