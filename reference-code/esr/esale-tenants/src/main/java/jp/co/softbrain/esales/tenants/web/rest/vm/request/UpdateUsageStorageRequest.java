package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Request of UpdateUsageStorage api
 *
 * @author nguyenvietloi
 */
@Data
public class UpdateUsageStorageRequest implements Serializable {

    private static final long serialVersionUID = 2230981095559568620L;

    private List<Long> tenantIds;
}
