package jp.co.softbrain.esales.customers.web.rest;

import java.io.IOException;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.service.dto.MasterMotivationInDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterStandsInDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateCustomerConnectionMapInDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateCustomerConnectionsMapOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.UpdateCustomerConnectionMapRequest;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;

@RestController
@RequestMapping("/api")
public class CustomerConnectionMapResource {

    @Autowired
    private CustomersService customersService;
    
    @Autowired
    private ObjectMapper mapper;

    /**
     * update Customer Connections Map
     *
     * @param request : request of API updateCustomerConnectionsMap
     * @return : UpdateCustomerConnectionsMapOutDTO : DTO out of API
     *         updateCustomerConnectionsMap
     * @throws IOException
     */
    @PostMapping(path = "/update-customer-connections-map", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateCustomerConnectionsMapOutDTO> updateCustomerConnectionsMap(
            @ModelAttribute UpdateCustomerConnectionMapRequest request) throws IOException {
        UpdateCustomerConnectionMapInDTO data = mapper.readValue(request.getData(), UpdateCustomerConnectionMapInDTO.class);
        List<Long> deletedMasterMotivations = data.getDeletedMasterMotivations();
        List<MasterMotivationInDTO> masterMotivations = data.getMasterMotivations();
        List<Long> deletedMasterStands = data.getDeletedMasterStands();
        List<MasterStandsInDTO> masterStands = data.getMasterStands();
        List<FileMappingDTO> files = S3FileUtil.creatFileMappingList(request.getFiles(), request.getFilesMap());
        return ResponseEntity.ok(customersService.updateCustomerConnectionsMap(deletedMasterMotivations,
                masterMotivations, deletedMasterStands, masterStands, files));
    }
}
