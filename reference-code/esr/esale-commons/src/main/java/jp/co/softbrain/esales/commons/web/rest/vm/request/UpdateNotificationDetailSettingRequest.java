package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.DataSettingNotificationDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update notification detail setting request
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateNotificationDetailSettingRequest implements Serializable {

    private static final long serialVersionUID = 3273418629489477772L;

    private Long employeeId;

    private List<DataSettingNotificationDTO> dataSettingNotifications;

    private Long notificationTime;

    private List<String> emails;
}
