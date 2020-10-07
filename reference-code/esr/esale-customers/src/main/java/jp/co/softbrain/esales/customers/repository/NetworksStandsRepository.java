package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.NetworksStands;

/**
 * NetworksStandsRepository
 *
 * @author lequyphuc
 */
@XRayEnabled
@Repository
public interface NetworksStandsRepository extends JpaRepository<NetworksStands, Long> {

    /**
     * Delete information of business card
     *
     * @pram businessCardCompanyId - remove businessCardCompanyId
     * @param businessCardDepartmentId - remove following
     *        businessCardDepartmentId
     * @param businessCardIds - remove following businessCardIds
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM networks_stands"
            + " WHERE business_card_company_id = :businessCardCompanyId"
            + " AND business_card_department_id = :businessCardDepartmentId"
            + " AND business_card_id IN (:businessCardIds)", nativeQuery = true)
    public void deleteInformationOfBusinessCard(@Param("businessCardCompanyId") Long businessCardCompanyId,
            @Param("businessCardDepartmentId") Long businessCardDepartmentId,
            @Param("businessCardIds") List<Long> businessCardIds);

    /**
     * find all business card id by business card company id and business card
     * department id
     *
     * @pram businessCardCompanyId- business card company id - condition to find
     * @param businessCardDepartmentId- businessCardDepartmentId - condition to find
     * @return List<Long> - list business card id
     */
    @Query(value = "SELECT business_card_id"
            + " FROM networks_stands"
            + " WHERE business_card_company_id = :businessCardCompanyId"
            + " AND business_card_department_id = :businessCardDepartmentId", nativeQuery = true)
    public List<Long> findAllByBusinessCardCompanyIdAndBusinessCardDepartmentId(
            @Param("businessCardCompanyId") Long businessCardCompanyId,
            @Param("businessCardDepartmentId") Long businessCardDepartmentId);

    /**
     * Get all networksStands with given business_card_id
     *
     * @param businessCardId the condition
     * @return list entity
     */
    List<NetworksStands> findByBusinessCardId(Long businessCardId);

    /**
     * Delete data position networkMap
     *
     * @pram companyId- delete by companyId
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM networks_stands "
            + "WHERE business_card_company_id IN (:companyId)", nativeQuery = true)
    public void deleteByBusinessCardCompanyId(@Param("companyId") List<Long> companyIds);

    /**
     * find By MasterStandId In
     *
     * @param masterMotivationIds : List id master motivations
     * @return List<NetworksStands>
     */
    List<NetworksStands> findByMotivationIdIn(List<Long> masterMotivationIds);

    /**
     * find By Stand Id
     *
     * @return List<NetworksStands>
     */
    List<NetworksStands> findByStandIdIn(List<Long> masterStandIds);

    /**
     * find by network stand id
     * 
     * @param networkStandId
     * @return the optinal response
     */
    public Optional<NetworksStands> findByNetworkStandId(Long networkStandId);

    /**
     * Delete by network stand id
     * 
     * @param networkStandId
     */
    @Modifying(clearAutomatically = true)
    public void deleteByNetworkStandId(Long networkStandId);

    /**
     * get list product trading id
     * 
     * @param businessCardIds - businessCardIds
     * @return list productTradingId
     */
    @Query(value = "SELECT ns.product_trading_id "
                 + "FROM networks_stands ns "
                 + "WHERE 1=1 "
            + "  AND ns.business_card_id IN (:businessCardIds) ", nativeQuery = true)
    List<Long> getProductTradingIdsByBusinessCardIds(@Param("businessCardIds")List<Long> businessCardIds);

    /**
     * Get info posistion and desire
     * @param listBusinessCardIds
     * @return
     */
    @Query(value = " SELECT ns.* "
                 + " FROM networks_stands ns "
                 + " WHERE 1=1 "
                 + "   AND ns.business_card_id IN (:listBusinessCardIds) ", nativeQuery = true)
    public List<NetworksStands> getInfoPosistionAndDesire(@Param("listBusinessCardIds") List<Long> listBusinessCardIds);

}
