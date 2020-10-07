package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ContractSiteErrorDataDTO
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractSiteErrorDataDTO implements Serializable {

    private static final long serialVersionUID = -6722008157896012037L;

    private String errorCode;

    private String errorMessage;
}
