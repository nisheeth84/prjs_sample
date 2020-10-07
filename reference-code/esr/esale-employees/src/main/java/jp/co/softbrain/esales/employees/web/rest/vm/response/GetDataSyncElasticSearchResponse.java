package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * GetDataSyncElasticSearchResponse
 */
@Data
@AllArgsConstructor
public class GetDataSyncElasticSearchResponse implements Serializable {

    private static final long serialVersionUID = 1555768758081720465L;

    private List<EmployeeElasticsearchDTO> employees;
}
