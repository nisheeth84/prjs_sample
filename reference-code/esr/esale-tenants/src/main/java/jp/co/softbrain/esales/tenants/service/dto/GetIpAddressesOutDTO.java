package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO for API getIPAddresses
 *
 * @author QuangLV
 */

@Data
@EqualsAndHashCode
public class GetIpAddressesOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8791328991870045480L;

    /**
     * ipAddresses : list IP address
     */
    private List<GetIpAddressesResponseDTO> ipAddresses;
}
