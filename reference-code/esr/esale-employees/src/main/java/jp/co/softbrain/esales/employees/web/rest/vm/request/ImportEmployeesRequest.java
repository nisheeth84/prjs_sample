package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesSubType3DTO;
import lombok.Data;

@Data
public class ImportEmployeesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5739658243162367256L;
    private int importMode;
    private boolean isRegistDuplicatedMode;
    private List<String> matchingKeys;
    private List<ImportEmployeesSubType1DTO> mappingDefinitions;
    private ImportEmployeesSubType3DTO reportMails;
    private boolean isSimulationMode;
    private List<List<String>> fileCsvContent;
}
