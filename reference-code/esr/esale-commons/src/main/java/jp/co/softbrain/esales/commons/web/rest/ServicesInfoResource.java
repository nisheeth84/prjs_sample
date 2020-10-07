package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.ServicesInfoService;
import jp.co.softbrain.esales.commons.service.dto.ServicesInfoOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetServicesInfoRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetServicesInfoResponse;

/**
 * query class for API getServicesInfo
 *
 * @author nguyentienquan
 */
@RestController
@RequestMapping("/api")
public class ServicesInfoResource {

    @Autowired
    private ServicesInfoService servicesInfoService;

    /**
     * query for API getServicesInfo
     *
     * @param serviceType type of services to get
     * @return list data for graphql of API getServicesInfo
     */
    @PostMapping(path = "/get-services-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetServicesInfoResponse> getServicesInfo(@RequestBody GetServicesInfoRequest request) {
        List<ServicesInfoOutDTO> servicesInfo = servicesInfoService.getServicesInfo(request.getServiceType());
        return ResponseEntity.ok(new GetServicesInfoResponse(servicesInfo));
    }
}
