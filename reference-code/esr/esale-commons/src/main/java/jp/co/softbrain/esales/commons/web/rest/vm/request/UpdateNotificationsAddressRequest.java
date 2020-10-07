package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Update Notifications Address Request
 *
 * @author DatDV
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class UpdateNotificationsAddressRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3273418629489499992L;

    /**
     * notificationId
     */
    private Long notificationId;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
