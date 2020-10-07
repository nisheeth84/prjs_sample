package jp.co.softbrain.esales.customers.service;

import java.io.IOException;
import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO;
import jp.co.softbrain.esales.customers.service.dto.IntegrateCustomerInDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerIdOutResponse;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.RelationDataInfosInDTO;

/**
 * Create, Update, Delete for Customer
 * 
 * @author phamminhphu
 */
@XRayEnabled
public interface CustomersCUDService {

    /**
     * Create new customer
     *
     * @param inputData
     *            - informations of main table
     * @param filesMap
     *            - data product trading
     * @return - id has been created
     * @throws IOException
     */
    public Long createCustomer(CustomersInputDTO inputData,
            List<FileMappingDTO> filesMap) throws IOException;

    /**
     * Update informations customer
     *
     * @param inputData
     *            - informations of main table
     * @param dataProductTradings
     *            - data product trading
     * @return - id has been updated
     * @throws IOException
     */
    public Long updateCustomer(CustomersInputDTO inputData,
            List<FileMappingDTO> filesMap) throws IOException;

    /**
     * Update list informations of list customers
     *
     * @param customers
     *            - list information used to update
     * @param filesMap
     *            list file map
     * @return - list id has been update
     * @throws IOException
     */
    public List<Long> updateCustomers(List<CustomersInputDTO> customers, List<FileMappingDTO> filesMap)
            throws IOException;

    /**
     * API update data for Relation category
     * 
     * @param recordId
     *            recordId
     * @param relationDataInfos
     *            relationDataInfos
     * @return list ids
     */
    public List<Long> updateRelationData(Long recordId, List<RelationDataInfosInDTO> relationDataInfos);

    /**
     * Implement customer data integration and Save history List<FileMappingDTO>
     * filesMap
     * 
     * @param integrateCustomer
     * @param filesMap
     * @return Customer ID is integrated
     */
    public CustomerIdOutResponse integrateCustomer(IntegrateCustomerInDTO integrateCustomer,
            List<FileMappingDTO> filesMap) throws IOException;
}
