package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 *  DTO for query getPackages API.
 *
 * @author lehuuhoa
 */
@Data
public class GetServicesByPackageIdsRequest implements Serializable {
    
    private static final long serialVersionUID = -4838799854180616554L;
    
    private List<Long> packageIds;
}
