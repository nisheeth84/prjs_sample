package jp.co.softbrain.esales.employees.service.dto;

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

    private static final long serialVersionUID = -1412369615726797415L;

    private String errorCode;

    private String errorMessage;
}
