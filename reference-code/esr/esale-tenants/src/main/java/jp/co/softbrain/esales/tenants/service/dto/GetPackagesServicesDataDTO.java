package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for GetPackagesServices API packages services information.
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetPackagesServicesDataDTO implements Serializable {

    private static final long serialVersionUID = -2583321771611332389L;
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
