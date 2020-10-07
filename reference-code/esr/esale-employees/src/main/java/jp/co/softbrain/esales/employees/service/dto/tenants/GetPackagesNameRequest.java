package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 *  Data request for GetPackagesName API.
 *
 * @author lehuuhoa
 */
@Data
public class GetPackagesNameRequest implements Serializable {

    private static final long serialVersionUID = 5014770589809782120L;
    
    private List<Long> packageIds;
}
