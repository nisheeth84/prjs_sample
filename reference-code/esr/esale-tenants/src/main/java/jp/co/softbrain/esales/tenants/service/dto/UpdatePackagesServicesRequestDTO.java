package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * All data DTO for updatePackagesServices API package service information request .
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePackagesServicesRequestDTO implements Serializable {

    private static final long serialVersionUID = -8235071005583002827L;
    /**
     * サービスID
     */
    private Long packageServiceId;
    /**
     * パッケージID
     */
    private Long packageId;
    /**
     * サービスID
     */
    private Long serviceId;
    /**
     * 子パッケージID
     */
    private Long childId;
    /**
     * 有効・無効判断フラグ
     */
    private Boolean isActive;
}
