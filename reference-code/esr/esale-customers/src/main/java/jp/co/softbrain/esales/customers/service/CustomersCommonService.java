package jp.co.softbrain.esales.customers.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateDataChangeElasticSearchInDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetParentCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetDetailElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerInfoDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;

/**
 * Service for managing common services
 */
@XRayEnabled
public interface CustomersCommonService {

    /**
     * Get information of employee's lists
     * 
     * @param employeeId - owner of lists
     * @param groupIds
     * @param depOfEmployee
     * @param mode mode of list
     * @return list DTO contains informations
     */
    public List<CustomersListOptionalsDTO> getMyList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode);

    /**
     * Get information of shared list
     * 
     * @param employeeId - id has shared its lists
     * @param groupIds - id group of employee
     * @param departmentIds - id department of employees
     * @param mode - conditions mode of lists
     * @return - list DTO contains informations
     */
    public List<CustomersListOptionalsDTO> getSharedList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode);

    /**
     * Get information of favorites list
     * 
     * @param employeeId - id has list
     * @param groupIds
     * @param departmentIds
     * @return - list DTO contains informations
     */
    public List<CustomersListOptionalsDTO> getFavouriteList(Long employeeId, List<Long> departmentIds,
            List<Long> groupIds);

    /**
     * Get list childs of given customerId
     * 
     * @param customerId - id condition
     * @return list childs DTO
     */
    public List<CustomersDTO> getChildCustomers(Long customerId);

    /**
     * Remove favorites list
     * 
     * @param employeeId - id has favorites list
     * @param customerListId - id of list customers
     */
    public void removeFavouriteList(Long employeeId, Long customerListId);


    /**
     * Delete all favorites list by customer list id.
     * 
     * @param customerListId - id of list customers
     */
    public void deleteAllFavoriteListByCustomerListId(Long customerListId);
    
    /**
     * Copy file to s3 cloud.
     * 
     * @param fileName file name file upload
     * @param fileExtension file extension file upload
     * @param content content file upload
     * @return path save file.
     */
    public String copyFileToS3(String fileName, String fileExtension, String content);

    /**
     * Get data customers by given id and sort by order
     * 
     * @param customerIds - list id to get data
     * @param orderBy - order list
     * @return list DTO
     */
    public List<CustomersDTO> getCustomers(List<Long> customerIds, List<KeyValue> orderBy);

    /**
     * Get all name of column of table
     * 
     * @param tableName - name of table
     * @return list column name
     */
    public List<String> getTableColumnName(String tableName);

    /**
     * request change data elasticsearch
     * 
     * @param customerIds - list id customer
     * @param action - action change data
     * @return true if change data elasticsearch susccess
     */
    public Boolean syncDataElasticSearch(List<Long> customerListIds, List<Long> customerIds, int action);

    /**
     * Get customer information from database to sync to aws elastic search
     * 
     * @param customerIds - list id customer
     * @return list DTO
     */
    public List<CustomerInfoDTO> getDataSyncElasticSearch(List<Long> customerIds);

    /**
     * Get the calendar_id list affected by the data change, then call the api to
     * store this calendar_id change
     * 
     * @param parameterConditions
     *            - list parameter
     * @return true if change success
     */
    public Boolean createDataChangeElasticSearch(List<CreateDataChangeElasticSearchInDTO> parameterConditions);

    /**
     * Get parent of customer
     * 
     * @param customerIds
     *            list customer id
     * @return manager of customer information
     */
    public List<GetParentCustomersDTO> getParentCustomers(List<Long> customerIds);

    /**
     * Get data for each scenario of milestone screen
     *
     * @param customerId
     *            - customer id to get data
     * @return object contains data
     */
    public GetScenarioOutDTO getScenario(Long customerId);

    /**
     * Get data from elastic search
     * 
     * @param elasticSearchRequest - request to elasticSearch
     * @return elastic search response
     */
    public SelectDetailElasticSearchResponse getDetailDataFromElasticSearch(
            GetDetailElasticSearchRequest elasticSearchRequest);

    /**
     * get list Calculator formular
     * 
     * @param fieldBelong - fieldBelong
     * @return - list cacular
     */
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong);

    /**
     * get data for relation, organization and calculation field
     * 
     * @param recordIds
     *            id of record
     * @param fieldInfo
     *            fields to get
     * @return List data of field
     */
    public GetDataByRecordIdsOutDTO getDataByRecordIds(List<Long> recordIds, List<GetDataByRecordIdsInDTO> fieldInfo);
}
