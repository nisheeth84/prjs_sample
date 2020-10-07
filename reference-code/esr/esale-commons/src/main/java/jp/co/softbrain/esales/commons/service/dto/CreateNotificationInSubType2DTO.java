package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType2DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 173473576376L;

    /**
     * valueId
     */
    private Long valueId;
    /**
     * valueName
     */
    private String valueName;

    /**
     * receivers
     */
    private List<ReceiverDTO> receivers;
    /**
     * mode
     */
    private int mode;

}
