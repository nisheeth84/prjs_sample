package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.domain.MTemplates;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for the {@link MTemplates} entity
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MTemplateInfoDTO implements Serializable {

    private static final long serialVersionUID = 8740775664979308037L;

    /**
     * The name of micro service
     */
    private String microServiceName;

    /**
     * S3 file path
     */
    private String fileName;
}
