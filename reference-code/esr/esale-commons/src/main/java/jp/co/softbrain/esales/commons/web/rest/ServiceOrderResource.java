package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.ServiceOrderService;
import jp.co.softbrain.esales.commons.service.dto.GetServiceOrderOutDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateServiceOrderRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetServiceOrderRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateServiceOrderRequest;

/**
 * ServiceOrderResource
 *
 * @author ThaiVV
 */
@RestController
@RequestMapping("/api")
public class ServiceOrderResource {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    ServiceOrderService serviceOrderService;

    /**
     * createServiceOrder : create Service Order
     * 
     * @param req : DTO in of API createServiceOrder
     * @return ServiceOrderOutDTO : DTO out of API updateServiceOrder
     */
    @PostMapping(path = "/create-service-order", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ServiceOrderOutDTO> createServiceOrder(@RequestBody CreateServiceOrderRequest req) {
        return ResponseEntity.ok(serviceOrderService.createServiceOrder(jwtTokenUtil.getEmployeeIdFromToken(), req.getData()));
    }

    /**
     * updateServiceOrder : update Service Order
     * 
     * @param req : DTO in of API updateServiceOrder
     * @return ServiceOrderOutDTO : DTO out of API updateServiceOrder
     */
    @PostMapping(path = "/update-service-order", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ServiceOrderOutDTO> updateServiceOrder(@RequestBody UpdateServiceOrderRequest req) {
        return ResponseEntity
                .ok(serviceOrderService.updateServiceOrder(jwtTokenUtil.getEmployeeIdFromToken(), req.getData()));
    }

    /**
     * getServiceOrder : get Service Order
     * 
     * @param req : DTO in of API getServiceOrder
     * @return GetServiceOrderOutDTO : DTO out of API getServiceOrder
     */
    @PostMapping(path = "/get-service-order", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetServiceOrderOutDTO> getServiceOrder(@RequestBody GetServiceOrderRequest req) {
        return ResponseEntity.ok(serviceOrderService.getServiceOrder(jwtTokenUtil.getEmployeeIdFromToken(), req.getData()));
    }
}
