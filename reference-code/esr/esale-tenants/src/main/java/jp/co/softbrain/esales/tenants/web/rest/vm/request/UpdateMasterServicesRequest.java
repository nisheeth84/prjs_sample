package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterServicesRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A Data request updateMasterServices API
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMasterServicesRequest implements Serializable {

    private static final long serialVersionUID = -49613670408075599L;
    /**
     * List data services
     */
    private List<UpdateMasterServicesRequestDTO> services;
}
