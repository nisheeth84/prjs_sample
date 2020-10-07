package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;
import java.util.List;

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
