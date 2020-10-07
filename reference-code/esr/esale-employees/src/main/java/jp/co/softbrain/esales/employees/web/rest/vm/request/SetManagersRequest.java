package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.SetManagersInDTO;
import lombok.Data;

@Data
public class SetManagersRequest implements Serializable {
    
    private static final long serialVersionUID = 1L;
    private List<SetManagersInDTO> settingParams;
}
