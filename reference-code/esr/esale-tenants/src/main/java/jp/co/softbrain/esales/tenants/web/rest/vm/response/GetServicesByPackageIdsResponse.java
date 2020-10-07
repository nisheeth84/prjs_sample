package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.ServicesByPackageIdDataDTO;
import lombok.Data;

/**
 *   Response for GetServicesByPackageIds API.
 *
 * @author lehuuhoa
 */
@Data
public class GetServicesByPackageIdsResponse implements Serializable {

    private static final long serialVersionUID = -3673457720229088644L;
    
    private List<ServicesByPackageIdDataDTO> data;
}
