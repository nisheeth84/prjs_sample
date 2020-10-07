package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.TabsInfo;

/**
 * Spring Data repository for the TabsInfo entity.
 * 
 * @author buithingocanh
 */
@Repository
@XRayEnabled
public interface TabsInfoRepository extends JpaRepository<TabsInfo, Long> {

    /**
     * Get the list of tabs
     * 
     * @param tabBelong tab belong
     * @return the list of Tab Response DTO
     */
    @Query(value = "SELECT * "
                + "FROM tab_info tab "
                + "WHERE tab.tab_belong = :tabBelong "
                + "ORDER BY tab.tab_order ASC ", nativeQuery = true)
    List<TabsInfo> getTabsInfo(@Param("tabBelong") Integer tabBelong);
    
    /**
     * find TabsInfo by tabInfoId
     * @param tabInfoId data need for find
     * @return data after find
     */
    Optional<TabsInfo> findByTabInfoId(Long tabInfoId);
    

}
