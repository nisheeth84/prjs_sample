package jp.co.softbrain.esales.tenants.service.dto.settingenvironment;

import java.io.Serializable;

import lombok.Data;
import software.amazon.awssdk.services.quicksight.model.CreateDataSourceResponse;
import software.amazon.awssdk.services.quicksight.model.CreateGroupResponse;

/**
 * Class that be contained information after setting quick sight
 *
 * @author tongminhcuong
 */
@Data
public class SettingQuickSightResult implements Serializable {

    private static final long serialVersionUID = -5999173291331444341L;

    private String tenantName;

    private String databaseAccount;

    private CreateGroupResponse createGroupResponse;

    private CreateDataSourceResponse createDataSourceResponse;
}
