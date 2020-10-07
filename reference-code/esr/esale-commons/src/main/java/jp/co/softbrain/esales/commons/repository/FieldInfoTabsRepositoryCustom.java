package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType2DTO;

/**
 * Repository custom for field info tab
 */
@Repository
@XRayEnabled
public interface FieldInfoTabsRepositoryCustom {

    /**
     * Get list of items and the order displayed in the list on the details
     * screen
     * 
     * @param tabBelong Functional use
     * @param tabId Usage tab
     * @return list field info tab
     */
    List<GetFieldInfoTabsOutSubType2DTO> getFieldInfoTabs(Integer tabBelong, Integer tabId);
    
}
