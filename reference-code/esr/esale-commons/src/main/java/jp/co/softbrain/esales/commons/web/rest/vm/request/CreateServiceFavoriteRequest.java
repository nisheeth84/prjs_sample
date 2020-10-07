package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Create Service Favorite Request
 * 
 * @author TuanLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CreateServiceFavoriteRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8707017371838856146L;
    /**
     * serviceId
     */
    private Long serviceId;
    /**
     * employeeId
     */
    private Long employeeId;
    /**
     * serviceName
     */
    private String serviceName;
}
