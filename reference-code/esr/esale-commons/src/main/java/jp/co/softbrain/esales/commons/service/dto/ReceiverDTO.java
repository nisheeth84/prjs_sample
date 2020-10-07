package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * ReceiverDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class ReceiverDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 147192747102741L;

    /**
     * receiverId
     */
    private Long receiverId;
    /**
     * receiverName
     */
    private String receiverName;
}
