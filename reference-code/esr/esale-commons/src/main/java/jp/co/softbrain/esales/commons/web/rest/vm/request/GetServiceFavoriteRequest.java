package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get Service Favorite Request
 * 
 * @author TuanLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetServiceFavoriteRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8707417311838856146L;
    /**
     * employeeId
     */
    private Long employeeId;
}
