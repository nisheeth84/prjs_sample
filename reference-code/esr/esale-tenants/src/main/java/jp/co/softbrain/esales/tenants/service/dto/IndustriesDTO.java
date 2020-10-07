package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.domain.MIndustries;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO of {@link MIndustries}
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndustriesDTO implements Serializable {

    private static final long serialVersionUID = -2038946939118993090L;

    /**
     * The id of MIndustry
     */
    private Long mIndustryId;

    /**
     * The type name of MIndustry
     */
    private String industryTypeName;

    /**
     * The name of master schema
     */
    private String schemaName;
}
