package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for Template.
 *
 * @author nguyenvietloi
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class MTemplatesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 24324882254445249L;

    private Long mTemplateId;

    private String microServiceName;

    private Long mIndustryId;

    private String fileName;
}
