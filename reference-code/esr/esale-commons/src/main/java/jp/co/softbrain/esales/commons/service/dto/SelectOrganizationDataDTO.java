package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO use to customize response fields.select_organization_data getting from
 * field_info_item entity
 */
@Data
@EqualsAndHashCode
public class SelectOrganizationDataDTO implements Serializable {

    private static final long serialVersionUID = 706747635878142452L;

    /**
     * extensionBelong
     */
    @JsonAlias("target")
    private String target;

    /**
     * relationFormat
     */
    @JsonAlias("format")
    private Integer format;
}
