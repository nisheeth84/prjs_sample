package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api CountUnreadNotificationOutDTO
 * 
 * @author ngant
 */
@Data
@EqualsAndHashCode
public class CountUnreadNotificationOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6291465971039571811L;

    /**
     * unreadNotificationNumber
     */
    private Long unreadNotificationNumber;
}
