package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.domain.IpAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for the IpAddress entity.
 *
 * @author QuangLV
 */
@Repository
@XRayEnabled
public interface IpAddressRepository extends JpaRepository<IpAddress, Long> {

    /**
     * findByIpAddressId : get the entity by id
     * @param ipAddressesId : ip addresses id
     * @return IpAddress : the ent?ty
     */
    Optional<IpAddress> findByIpAddressId(Long ipAddressesId);

    /**
     * deletebyIpAddresses : remove IP address by IP address id
     *
     * @param ipAdresses : list IP address id
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE  " +
                   "FROM ip_address " +
                   "WHERE ip_address_id IN ( :ipAdresses) ", nativeQuery = true)
    void deleteByIpAddresses(@Param("ipAdresses") List<Long> ipAdresses);

    /**
     * findByIpAddress : get all IPAdress by list IP addresses id
     *
     * @param ipAddressesId : list IP addresses id
     * @return List<IpAddress> : list IpAddress
     */
    List<IpAddress> findByIpAddressIdIn(List<Long> ipAddressesId);

    /**
     * delete by primary key
     *
     * @param id
     */
    void deleteByIpAddressId(Long id);

    /**
     * countIpAddress : check exist IP address in database
     *
     * @param ipAddress : IP address need check duplicate
     * @return BigDecimal : the number of records in the table IpAddress
     */
    @Query(value = "SELECT count(1) " +
                   "FROM ip_address ip " +
                   "WHERE ip.ip_address = :ipAddress", nativeQuery = true)
    Long countIpAddress(@Param("ipAddress") String ipAddress);
}
