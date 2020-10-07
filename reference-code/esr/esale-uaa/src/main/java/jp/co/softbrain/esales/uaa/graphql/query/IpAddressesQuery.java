package jp.co.softbrain.esales.uaa.graphql.query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;

import jp.co.softbrain.esales.uaa.service.IpAddressService;
import jp.co.softbrain.esales.uaa.service.dto.CheckAccessIpAddressesOutDTO;
import jp.co.softbrain.esales.uaa.service.dto.GetIpAddressesOutDTO;

/**
 * GetIPAddressesQuery class process GraphQL query for API getIpAddresses
 *
 * @author QuangLV
 */

@Component
@XRayEnabled
public class IpAddressesQuery implements GraphQLQueryResolver {

    @Autowired
    private IpAddressService ipAddressService;

    /**
     * getIPAddresses : get all IP address
     *
     * @return GetIpAddressesOutDTO : list DTO out of API getIPAddresses
     */
    public GetIpAddressesOutDTO getIPAddresses() {
        return ipAddressService.getIpAddresses();
    }

    /**
     * checkAccessIpAddresses : check access IP addresses
     * 
     * @param ipAddress : IP address
     * @return CheckAccessIpAddressesOutDTO : return true or false of API
     *         checkAccessIpAddresses
     */
    public CheckAccessIpAddressesOutDTO checkAccessIpAddresses(String ipAddress) {
        return ipAddressService.checkAccessIpAddresses(ipAddress);
    }
}
