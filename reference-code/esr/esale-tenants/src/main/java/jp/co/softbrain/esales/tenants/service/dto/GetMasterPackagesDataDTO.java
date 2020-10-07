package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for GetMasterPackage API package information
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetMasterPackagesDataDTO implements Serializable {

    private static final long serialVersionUID = -4933458135480899696L;
    /**
     * パッケージID
     */
    private Long packageId;
    /**
     * パッケージ名
     */
    private String packageName;
    /**
     * タイプ
     */
    private Integer type;
    /**
     * 有効期限
     */
    private String expirationDate;
}
