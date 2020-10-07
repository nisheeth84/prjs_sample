package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request entity for API update-tenants
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTenantsRequest implements Serializable {

    private static final long serialVersionUID = 5691649562252246030L;

    private List<String> contractTenantIds;

    private int status;

    private String trialEndDate;

    private Boolean isDeleteSampleData;
}
