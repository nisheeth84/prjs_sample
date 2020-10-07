package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesResponseDTO;

/**
 * The repository custom for IpAddress
 *
 * @author QuangLV
 */
@XRayEnabled
@Repository
public interface IpAddressRepositoryCustom {

    /**
     * getIpAddresses : get ip addresses
     *
     * @param tenantName : tenant id
     * @return GetIpAddressesResponseDTO : response for
     *         GetIpAddressesResponseDTO
     */
    List<GetIpAddressesResponseDTO> getIpAddresses(String tenantName);

}
