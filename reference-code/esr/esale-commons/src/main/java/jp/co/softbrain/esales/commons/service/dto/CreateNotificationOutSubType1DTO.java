package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationOutSubType1DTO
 */
@Data
@EqualsAndHashCode
public class CreateNotificationOutSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 172473478486L;

    /**
     * reciverId
     */
    private Long reciverId;
    /**
     * messages
     */
    private List<String> messages = new ArrayList<>();

}
