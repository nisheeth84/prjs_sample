package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Request of Update/Rollback MasterTemplate api
 *
 * @author nguyenvietloi
 */
@Data
public class MasterTemplateRequest implements Serializable {

    private static final long serialVersionUID = 2230981097779568620L;

    private String industryTypeName;

    private List<String> microServiceNames;
}
