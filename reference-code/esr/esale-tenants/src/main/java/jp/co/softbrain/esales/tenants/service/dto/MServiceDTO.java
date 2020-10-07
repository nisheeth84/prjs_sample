package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for query findMicroServicesById.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MServiceDTO implements Serializable {

    private static final long serialVersionUID = -8355558910644711116L;

    private Long mServiceId;

    private String microServiceName;
}
