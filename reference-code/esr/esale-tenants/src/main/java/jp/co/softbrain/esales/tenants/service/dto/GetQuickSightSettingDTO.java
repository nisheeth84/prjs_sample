package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API get-quicksight-setting
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetQuickSightSettingDTO implements Serializable {

    private static final long serialVersionUID = -7236764896430570648L;

    private String account;

    private String password;

    private String namespace;

    private String groupName;

    private String groupArn;

    private String datasourceArn;
}
