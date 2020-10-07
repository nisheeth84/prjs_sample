package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO use to customize response fields.select_organization_data getting from
 * field_info_item entity
 */
@Data
@EqualsAndHashCode
public class SelectOrganizationDataDTO implements Serializable {

    private static final long serialVersionUID = -5076235107885881005L;

    private String target;

    private Integer format;

}
