package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Template.
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MTemplateIndustryDTO implements Serializable {

    private static final long serialVersionUID = -9074379545157059426L;

    private String industryTypeName;

    private String industryTypeNameJp;
}
