package jp.co.softbrain.esales.tenants.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.CheckAccessIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.IpAddressDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdatedIpAddressesOutDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.tenants.domain.IpAddress}.
 *
 * @author QuangLV
 */

@XRayEnabled
public interface IpAddressService {

    /**
     * save : Save a ipAddress.
     *
     * @param ipAddressDTO : the entity to save.
     * @return the persisted entity.
     */
    IpAddressDTO save(IpAddressDTO ipAddressDTO);

    /**
     * findAll : Get all the ipAddresses.
     *
     * @return the list of entities.
     */
    List<IpAddressDTO> findAll();

    /**
     * findOne : Get the "id" ipAddress.
     *
     * @param id : the id of the entity.
     * @return the entity.
     */
    Optional<IpAddressDTO> findOne(Long id);

    /**
     * delete : Delete the "id" ipAddress.
     *
     * @param id : the id of the entity.
     */
    void delete(Long id);

    /**
     * getIPAddresses : get all IP address
     *
     * @return GetIpAddressesOutDTO : list DTO out of API getIPAddresses
     */
    GetIpAddressesOutDTO getIpAddresses();

    /**
     * updateIpAddresses : insert or update IpAddress
     *
     * @param ipAddresses : data insert or update IpAddress
     * @param deletedIpAddresses : list IP address want to delete
     * @return UpdatedIPAddressesOutDTO : the DTO out for API updateIpAddresses
     */
    UpdatedIpAddressesOutDTO updateIpAddresses(List<IpAddressDTO> ipAddresses, List<Long> deletedIpAddresses);

    /**
     * checkAccessIpAddresses : check access IP addresses
     *
     * @param ipAddress : IP address
     * @return CheckAccessIpAddressesOutDTO : return true or false of API
     *         checkAccessIpAddresses
     */
    CheckAccessIpAddressesOutDTO checkAccessIpAddresses(String ipAddress);
}
