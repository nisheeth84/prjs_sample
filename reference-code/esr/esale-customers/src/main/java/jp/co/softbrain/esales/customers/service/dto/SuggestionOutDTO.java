package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SuggestionOutDTO
 * 
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class SuggestionOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -71769749670683079L;
    /**
     * customerListId
     */
    private Long customerListId;
    /**
     * customerListName
     */
    private String customerListName;
    /**
     * customerListType
     */
    private Integer customerListType;
    /**
     * isAutoList
     */
    private Boolean isAutoList;
    /**
     * lastUpdatedDate
     */
    private Instant lastUpdatedDate;
    /**
     * isOverWrite
     */
    private Boolean isOverWrite;
    /**
     * employeeName
     */
    private String employeeName;
    /**
     * isOverWrite
     */
    private Boolean isFavoriteList;

    /**
     * participantType
     */
    private Integer participantType;
}
