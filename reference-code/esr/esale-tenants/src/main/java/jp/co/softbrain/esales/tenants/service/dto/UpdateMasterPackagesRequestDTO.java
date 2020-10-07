package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * All data DTO for UpdateMasterPackages API package information request .
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMasterPackagesRequestDTO implements Serializable {

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
