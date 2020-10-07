package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.CreateDataChangeElasticSearchInDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateDataChangeResponse
 *
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class CreateDataChangeRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7299149761519550373L;

    /**
     * parameterConditions
     */
    private List<CreateDataChangeElasticSearchInDTO> parameterConditions;
}
