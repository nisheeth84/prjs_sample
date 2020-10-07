package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.ServiceOrderSubTypesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Create Service Order Request
 *
 * @author ThaiVV
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateServiceOrderRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8706016371838856146L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * data
     */
    private List<ServiceOrderSubTypesDTO> data;
}
