package jp.co.softbrain.esales.commons.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.DataChangeDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.DataChange}.
 * 
 * @author chungochai
 */
@XRayEnabled
public interface DataChangeService {

    /**
     * Get all the dataChanges.
     *
     * @return the list of entities.
     */
    List<DataChangeDTO> findAll();
    
    /**
     * Create data change
     * 
     * @param extensionBelong
     * @param dataIds list data id
     * @param action 0: Delete; 1: Insert; 2: Update
     * @return
     */
    List<Long> createDataChange(Integer extensionBelong, List<Long> dataIds, Integer action);

    /**
     * Delete data change
     * 
     * @param dataChangeIds list dataChangeId
     * @return
     */
    Integer deleteDataChange(List<Long> dataChangeIds);
}
