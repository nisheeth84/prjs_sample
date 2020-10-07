package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;
import jp.co.softbrain.esales.commons.service.dto.ImportHistoriesDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ImportHistoriesResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8706017871838856146L;
    
    /**
     * importHistories
     */
    private List<ImportHistoriesDTO> importHistories;

}
