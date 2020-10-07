package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The DTO for refresh token.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenDTO {

    private String tokenNew;
}
