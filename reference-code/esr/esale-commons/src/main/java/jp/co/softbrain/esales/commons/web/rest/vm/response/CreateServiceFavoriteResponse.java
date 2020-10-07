package jp.co.softbrain.esales.commons.web.rest.vm.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * CreateServiceFavoriteResponse
 *
 * @author TuanLv
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceFavoriteResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8706017871838856146L;

    /**
     * serviceId
     */
    private Long serviceId;

}
