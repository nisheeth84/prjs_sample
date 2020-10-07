package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * All data DTO for updateMasterServices API master service information request.
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMasterServicesRequestDTO implements Serializable {

    private static final long serialVersionUID = -4933458135480899696L;
    /**
     * サービスID
     */
    private Long serviceId;
    /**
     * サービス名
     */
    private String serviceName;
    /**
     * マイクロサービス名
     */
    private String microServiceName;
    /**
     * 有効・無効判断フラグ
     */
    private Boolean isActive;
}
