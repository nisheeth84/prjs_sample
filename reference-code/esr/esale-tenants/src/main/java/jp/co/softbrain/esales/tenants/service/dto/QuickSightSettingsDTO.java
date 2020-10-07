package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.domain.QuickSightSettings;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for the {@link QuickSightSettings}
 *
 * @author tongminhcuong
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class QuickSightSettingsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -8031080167599018455L;

    private Long quicksightSettingsId;

    private Long tenantId;

    private String postgresqlAccount;

    private String postgresqlPassword;

    private String namespace;

    private String groupName;

    private String groupArn;

    private String datasourceArn;
}
