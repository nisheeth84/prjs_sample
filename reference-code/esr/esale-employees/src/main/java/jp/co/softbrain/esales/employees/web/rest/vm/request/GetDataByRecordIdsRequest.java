package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API getDataByRecordIds
 * 
 * @author nguyentrunghieu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetDataByRecordIdsRequest implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * recordIds
     */
    private List<Long> recordIds;

    /**
     * fieldInfo
     */
    private List<GetDataByRecordIdsInDTO> fieldInfo;
}
