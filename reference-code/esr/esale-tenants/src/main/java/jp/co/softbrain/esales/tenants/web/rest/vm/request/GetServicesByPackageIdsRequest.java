package jp.co.softbrain.esales.tenants.web.rest.vm.request;

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

    private static final long serialVersionUID = -4943599605791934078L;
    
    private List<Long> packageIds;
}
