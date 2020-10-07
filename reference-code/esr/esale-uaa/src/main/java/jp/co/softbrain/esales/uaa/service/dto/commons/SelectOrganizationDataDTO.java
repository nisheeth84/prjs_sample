package jp.co.softbrain.esales.uaa.service.dto.commons;

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

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = -2934469322333160534L;

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
