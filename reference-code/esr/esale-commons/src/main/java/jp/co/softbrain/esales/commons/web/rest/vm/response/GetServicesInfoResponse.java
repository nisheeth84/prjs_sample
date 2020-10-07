/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.ServicesInfoOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * response for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
public class GetServicesInfoResponse implements Serializable {
    private static final long serialVersionUID = -7160189821084045598L;

    private List<ServicesInfoOutDTO> servicesInfo;
}
