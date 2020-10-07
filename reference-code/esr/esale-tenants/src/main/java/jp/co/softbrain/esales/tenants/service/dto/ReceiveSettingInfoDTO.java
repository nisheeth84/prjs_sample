package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response from API receive-setting-request
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiveSettingInfoDTO implements Serializable {

    private static final long serialVersionUID = 3284578860818055868L;

    private String message;

    private Long tenantId;

    private String tenantName;

    private String urlLogin;

    private String userName;
}
