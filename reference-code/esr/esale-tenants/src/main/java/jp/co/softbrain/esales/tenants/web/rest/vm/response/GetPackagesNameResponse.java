package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.GetPackagesDataDTO;
import lombok.Data;

/**
 *  Response for GetPackagesName API.
 *
 * @author lehuuhoa
 */
@Data
public class GetPackagesNameResponse implements Serializable {

    private static final long serialVersionUID = -857307172342289410L;

    private List<GetPackagesDataDTO> packages;
}
