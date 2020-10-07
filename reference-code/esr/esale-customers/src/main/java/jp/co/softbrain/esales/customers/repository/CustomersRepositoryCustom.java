package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersSupType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionResultSqlMappingDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType3DTO;
import jp.co.softbrain.esales.customers.service.dto.GetParentCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.InformationDetailsCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.SelectCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType1DTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;

/**
 * Spring Data repository for the Customers entity
 *
 * @author phamminhphu
 *
 */
@Repository
@XRayEnabled
public interface CustomersRepositoryCustom {

    /**
     * Get customer info to initialize network map
     *
     * @param customerId the if of customer
     * @return the DTO response
     */
    List<InitializeNetworkMapCustomerDTO> getCustomerInfo(Long customerId);

    /**
     * get information for list customers
     *
     * @param searchConditionsDto the entity of searchConditionsDto
     * @param employeeId the id of the employee login
     * @return the list object of SelectCustomersDTO
     */
    public List<SelectCustomersDTO> getCustomers(CustomersSearchConditionsDTO searchConditionsDto);

    /**
     * get count total customer by conditions
     *
     * @param searchConditionsDto - conditions
     * @return - counted
     */
    public int getCountTotalCustomers(CustomersSearchConditionsDTO searchConditionsDto);

    /**
     * Get list columnName by tableName
     *
     * @param tableName tableName
     * @return list columnName
     */
    public List<String> getTableColumnName(String tableName);

    /**
     * Get information of customer
     *
     * @param customerId customer id
     * @return customer information
     */
    public List<InformationDetailsCustomerDTO> getInformationDetailCustomer(List<Long> customerIds);

    /**
     * get Child customer data
     *
     * @param customerId the customerId of the entity
     * @return Child data list
     */
    public List<GetChildCustomersSupType1DTO> getChildCustomers(Long customerId);

    /**
     * get information customers
     *
     * @param limit limit
     * @param currentPage current page
     * @param searchConditions the array conditions
     * @return the entity list of GetCustomersTabSubType3DTO
     */
    public List<GetCustomersTabSubType3DTO> getInfoCustomers(Integer limit, Integer currentPage,
            List<GetCustomersTabSubType1DTO> searchConditions);

    /**
     * Get customer information according to search terms
     *
     * @param keyWords keyWords
     * @return the entity list of GetCustomerSuggestionResultSqlMappingDTO
     */
    public List<GetCustomerSuggestionResultSqlMappingDTO> getCustomerSuggestion(String keyWords);

    /**
     * Get data customers by given id and sort by order
     *
     * @param customerIds - list id to get data
     * @param orderBy - order list
     * @return list DTO
     */
    public List<Customers> findByCustomerIdsAndSort(List<Long> customerIds, List<KeyValue> orderBy);

    /**
     * Get information of customer
     *
     * @param customerIds - list customer id
     * @return customer information
     */
    public List<GetCustomersByIdsSubType1DTO> getCustomersByIds(List<Long> customerIds);

    /**
     * Get list Customer id by field name
     *
     * @param fieldName
     *            column in table
     * @param fieldValue
     *            value
     * @return list customer id
     */
    public List<Long> getCustomerIdsByFieldName(String fieldName, List<Long> fieldValue);

    /**
     * Get parent Customer
     *
     * @param customerIds
     *            list id of customer
     * @return the list DTO response
     */
    public List<GetParentCustomersDTO> getParentCustomers(List<Long> customerIds);

    /**
     * Get customers ids with create relation
     *
     * @param customerIds
     *            list customerids
     * @param firstField
     *            field info first
     * @return list customer dto
     */
    public List<Long> getCustomersIdsCreatedRelation(List<Long> customerIds, CustomFieldsInfoOutDTO firstField);

    /**
     * Get customer by ids sugggestion
     *
     * @param customerIds list id of customer
     * @return list customer dto response
     */
    public List<GetCustomersByIdsSubType1DTO> getCustomersSuggestionByIds(List<Long> customerIds, List<Long> groupId,
            List<Long> employeeId, List<Long> departmentId, Integer offset, Integer limit);
    /**
     * get list calculator formular
     *
     * @param fieldBelong - fieldBelong
     * @return - list formular
     */
    List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong);

    /**
     * get calculator formular include one that doesn't display on list
     *
     * @param fieldBelong
     * @return
     */
    List<CalculatorFormularDTO> getAllCalculatorFormular(Integer fieldBelong);

    /**
     * Get Customer Field for Relation
     *
     * @param recordIds
     *            recordIds
     * @param fieldInfo
     *            fieldInfo
     * @return list GetDataByRecordIdsSubType1DTO
     */
    List<GetDataByRecordIdsSubType1DTO> getCustomerFieldsByRecordIds(List<Long> recordIds,
            List<GetDataByRecordIdsInDTO> fieldInfo);

    /**
     * Get the ID of the products that created the relation
     *
     * @param fields
     * @param customerIds
     * @return customerIds
     */
    List<Long> getCustomerIdsCreatedRelation(List<CustomFieldsInfoOutDTO> fields, List<Long> customerIds);
}
