package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.domain.MPackages;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for {@link MPackages} using ReceiveSettingRequest API
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiveSettingPackagesDTO implements Serializable {
    private static final long serialVersionUID = -8476160501036899828L;

    /**
     * パッケージID
     */
    private Long packageId;

    /**
     * ライセンス数
     */
    private Integer availablePackageNumber;
}
