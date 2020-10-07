package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
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
    private List<Long> deletedIpAddresses = new ArrayList<>();

    /**
     * List insertedIPAddresses
     */

    private List<Long> insertedIpAddresses = new ArrayList<>();

    /**
     * List updatedIPAddresses
     */

    private List<Long> updatedIpAddresses = new ArrayList<>();
}
