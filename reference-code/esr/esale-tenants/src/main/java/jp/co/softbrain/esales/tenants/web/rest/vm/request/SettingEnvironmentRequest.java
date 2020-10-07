package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request DTO for API setting-environment
 *
 * @author tongminhcuong
 */
@Data
public class SettingEnvironmentRequest implements Serializable {

    private static final long serialVersionUID = 2681419825161256636L;

    /**
     * The id of Tenant
     */
    private Long tenantId;

    /**
     * The id of language
     */
    private Long languageId;

    private boolean settingQuickSight; // TODO remove dummy
}
