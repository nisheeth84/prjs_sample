package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Master Motivation In DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class MasterMotivationInDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 3638481049296783033L;

    /**
     * masterMotivationId
     */
    private Long masterMotivationId;

    /**
     * masterMotivationName
     */
    private String masterMotivationName;

    /**
     * iconType
     */
    private Integer iconType;

    /**
     * iconData
     */
    private String iconData;

    /**
     * iconName
     */
    private String iconName;

    /**
     * backgroundColor
     */
    private String backgroundColor;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    private Integer displayOrder;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
