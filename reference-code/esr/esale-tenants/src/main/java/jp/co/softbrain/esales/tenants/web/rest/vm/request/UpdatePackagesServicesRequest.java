package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.UpdatePackagesServicesRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A Data request updatePackagesServices API
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePackagesServicesRequest implements Serializable {

    private static final long serialVersionUID = -4764658033564220337L;
    /**
     * List data package service
     */
    private List<UpdatePackagesServicesRequestDTO> packagesServices;
}
