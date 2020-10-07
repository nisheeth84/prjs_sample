package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.tenants.domain.IpAddress} entity.
 *
 * @author QuangLV
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class IpAddressDTO extends BaseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4081385002195726859L;

    /**
     * The ipAddressId
     */
    private Long ipAddressId;

    /**
     * The ipAddress
     */
    private String ipAddress;

    /**
     * The tenantId
     */
    private Long tenantId;

}
