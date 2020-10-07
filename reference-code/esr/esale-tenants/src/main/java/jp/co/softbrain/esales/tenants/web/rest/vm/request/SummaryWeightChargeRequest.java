package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Request of SummaryWeightCharge api
 *
 * @author nguyenvietloi
 */
@Data
public class SummaryWeightChargeRequest implements Serializable {

    private static final long serialVersionUID = 2230981094449568620L;

    private List<Long> tenantIds;
}
