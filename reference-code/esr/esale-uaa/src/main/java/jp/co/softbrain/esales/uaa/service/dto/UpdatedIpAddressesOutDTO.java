package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO for API updateIpAddresses
 * 
 * @author QuangLV
 */

@Data
@EqualsAndHashCode
public class UpdatedIpAddressesOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2001218514137526800L;

    /**
     * List deletedIPAddresses
     */
    private List<Long> deletedIpAddresses;

    /**
     * List insertedIPAddresses
     */

    private List<Long> insertedIpAddresses;

    /**
     * List updatedIPAddresses
     */

    private List<Long> updatedIpAddresses;
}
