package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * The Industry DTO.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndustryDTO implements Serializable {
    private static final long serialVersionUID = -7866606924484080111L;

    private Long mIndustryId;

    private String industryTypeName;

    private String schemaName;
}
