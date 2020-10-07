package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for response GetUserInfoByToken API.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetUserInfoByTokenResponseDTO implements Serializable {

    private static final long serialVersionUID = -8388878933687710776L;

    private Integer status;

    private UserInfoDTO data;

    private List<ErrorDTO> errors;
}
