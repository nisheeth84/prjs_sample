package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDTO;
import lombok.Data;

/**
 * GetMasterScenariosResponse
 */
@Data
public class GetMasterScenariosResponse implements Serializable {

    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5468811763982144700L;

    private List<MastersScenariosDTO> listMasterScenatrios;
}
