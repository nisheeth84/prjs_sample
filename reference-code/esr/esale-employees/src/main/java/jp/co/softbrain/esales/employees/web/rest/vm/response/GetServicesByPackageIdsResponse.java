package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.tenants.ServicesByPackageIdDataDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *   Response for GetServicesByPackageIds API.
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetServicesByPackageIdsResponse implements Serializable {
    
    private static final long serialVersionUID = 4418091826282264336L;
    
    private List<ServicesByPackageIdDataDTO> data;
}
