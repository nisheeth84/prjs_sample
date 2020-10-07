package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 *  Request entity for API get-quicksight-setting
 *
 * @author tongminhcuong
 */
@Data
public class GetQuickSightSettingRequest implements Serializable {

    private static final long serialVersionUID = -7636389596876037431L;

    /**
     * The name of tenant
     */
    private  String tenantName;
}
