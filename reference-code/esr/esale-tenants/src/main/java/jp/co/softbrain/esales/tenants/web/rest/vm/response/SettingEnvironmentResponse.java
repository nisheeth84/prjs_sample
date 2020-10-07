package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO response from API setting-environment
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class SettingEnvironmentResponse implements Serializable {

    private static final long serialVersionUID = -4923376694688568848L;

    /**
     * The message after setting process
     */
    private String message;
}
