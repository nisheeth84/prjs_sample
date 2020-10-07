package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;

/**
 * * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.TabsInfo}.
 * 
 * @author buithingocanh
 */
@XRayEnabled
public interface TabsInfoService {
    /**
     * Save a tabsInfo.
     *
     * @param tabsInfobDTO the entity to save.
     * @return the persisted entity.
     */
    TabsInfoDTO save(TabsInfoDTO tabsInfoDTO);

    /**
     * Get all the tabsInfo.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TabsInfoDTO> findAll(Pageable pageable);

    /**
     * Get the "id" tabsInfo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TabsInfoDTO> findByTabInfoId(Long id);

    /**
     * Delete the "id" tabsInfo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get the list of tabs displayed in the details screen
     * 
     * @param tabBelong value of tabBelong 
     * @return list of tabs displayed in the details screen
     */
    List<TabsInfoDTO> getTabsInfo(Integer tabBelong);

}
