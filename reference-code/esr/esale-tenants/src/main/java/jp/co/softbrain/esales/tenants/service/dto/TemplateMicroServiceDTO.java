package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for template matching microservice.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TemplateMicroServiceDTO implements Serializable {

    private static final long serialVersionUID = -2222410532609258940L;

    private Long mTemplateId;

    private String fileName;

    private Instant updatedDate;

    private String microServiceName;
}
