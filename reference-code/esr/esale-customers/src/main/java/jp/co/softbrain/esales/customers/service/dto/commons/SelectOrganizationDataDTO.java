package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO use to customize response fields.select_organization_data getting from
 * field_info_item entity
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
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
