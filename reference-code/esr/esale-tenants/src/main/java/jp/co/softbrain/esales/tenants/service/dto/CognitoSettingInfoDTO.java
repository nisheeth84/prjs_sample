package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import jp.co.softbrain.esales.tenants.repository.CognitoSettingsRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CognitoContractDTO
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CognitoSettingInfoDTO implements Serializable {

    private static final long serialVersionUID = 2397026926368510526L;

    private String userPoolId;

    private String clientId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String tenantName;

    private Boolean isPc;

    private Boolean isApp;

    private String providerName;

    private String referenceValue;

    private String metaDataPath;

    private String metaDataName;

    private Long cognitoSettingsId;

    private Instant updatedDate;

    /**
     * Constructor without tenant name
     * Using in {@link CognitoSettingsRepository#findCognitoSettingTenant(String, String)}
     *
     * @param userPoolId userPoolId
     * @param clientId clientId
     * @param isPc isPc
     * @param isApp isApp
     * @param providerName providerName
     * @param referenceValue referenceValue
     * @param metaDataPath metaDataPath
     * @param metaDataName metaDataName
     */
    public CognitoSettingInfoDTO(String userPoolId, String clientId, Boolean isPc, Boolean isApp,
            String providerName, String referenceValue, String metaDataPath, String metaDataName, Long cognitoSettingsId, Instant updatedDate) {
        this.userPoolId = userPoolId;
        this.clientId = clientId;
        this.isPc = isPc;
        this.isApp = isApp;
        this.providerName = providerName;
        this.referenceValue = referenceValue;
        this.metaDataPath = metaDataPath;
        this.metaDataName = metaDataName;
        this.cognitoSettingsId = cognitoSettingsId;
        this.updatedDate = updatedDate;
    }
}
