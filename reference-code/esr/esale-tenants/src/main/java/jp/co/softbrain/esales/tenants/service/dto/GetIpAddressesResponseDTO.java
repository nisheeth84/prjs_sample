package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetIpAddressesResponseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2150377198703333511L;

    /**
     * The ipAddressId
     */
    private Long ipAddressId;

    /**
     * The ipAddressId
     */
    private String ipAddress;

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
