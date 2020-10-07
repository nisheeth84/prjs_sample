package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import jp.co.softbrain.esales.tenants.service.dto.IpAddressDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateIpAddressesRequest implements Serializable {

    /**
     *  The serialVersionUID
     */
    private static final long serialVersionUID = -72023302318749599L;

    /**
     * The ipAddresses
     */
    List<IpAddressDTO> ipAddresses;

    /**
     * The deletedIpAddresses
     */
    List<Long> deletedIpAddresses;
}
