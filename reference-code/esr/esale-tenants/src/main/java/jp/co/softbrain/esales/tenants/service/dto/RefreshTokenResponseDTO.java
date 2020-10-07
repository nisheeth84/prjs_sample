package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for response refreshToken API.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponseDTO implements Serializable {

    private static final long serialVersionUID = -8366678933687710776L;

    private Integer status;

    private RefreshTokenDTO data;

    private List<ErrorDTO> errors;
}
