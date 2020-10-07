package jp.co.softbrain.esales.uaa.graphql.mutation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;

import jp.co.softbrain.esales.uaa.service.IpAddressService;
import jp.co.softbrain.esales.uaa.service.dto.IpAddressDTO;
import jp.co.softbrain.esales.uaa.service.dto.UpdatedIpAddressesOutDTO;

/**
 * UpdateIpAddressesMutation class process GraphQL query for API
 * updateIpAddresses
 *
 * @author QuangLV
 */

@Component
@XRayEnabled
public class UpdateIpAddressesMutation implements GraphQLMutationResolver {

    @Autowired
    private IpAddressService ipAddressService;

    /**
     * updateIpAddresses : insert or update IpAddress
     *
     * @param ipAddresses : data insert or update IpAddress
     * @param deletedIpAddresses : list ip address want to delete
     * @return UpdatedIPAddressesOutDTO : the DTO out for API updateIpAddresses
     */
    public UpdatedIpAddressesOutDTO updateIpAddresses(List<IpAddressDTO> ipAddresses, List<Long> deletedIpAddresses) {
        return ipAddressService.updateIpAddresses(ipAddresses, deletedIpAddresses);
    }
}
