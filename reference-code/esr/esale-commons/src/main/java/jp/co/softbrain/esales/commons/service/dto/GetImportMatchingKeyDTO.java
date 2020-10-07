package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.commons.web.rest.GetImportFieldsInfoResource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for api {@link GetImportFieldsInfoResource}
 * entity.
 * 
 * @author Trungnd
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetImportMatchingKeyDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * value
     */
    private String value;

    /**
     * label
     */
    private String label;
}
