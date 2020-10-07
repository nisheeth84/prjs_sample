package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.MenuFavoriteService;
import jp.co.softbrain.esales.commons.service.dto.CreateServiceFavoriteOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetServiceFavoriteOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateServiceFavoriteRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.DeleteServiceFavoriteRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetServiceFavoriteRequest;

/**
 * Create Service Favorite Resource
 *
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class ServiceFavoriteResource {

    @Autowired
    MenuFavoriteService menuFavoriteService;

    /**
     * Create Favorite
     *
     * @param req : req
     * @return serviceId
     */
    @PostMapping(path = "/create-service-favorite", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateServiceFavoriteOutDTO> createFavorite(@RequestBody CreateServiceFavoriteRequest req) {
        return ResponseEntity.ok(menuFavoriteService.createServiceFavorite(req.getEmployeeId(), req.getServiceId(),
                req.getServiceName()));
    }

    /**
     * Delete Favorite
     *
     * @param req : req
     * @return serviceId
     */
    @PostMapping(path = "/delete-service-favorite", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateServiceFavoriteOutDTO> deleteServiceFavorite(
            @RequestBody DeleteServiceFavoriteRequest req) {
        return ResponseEntity.ok(menuFavoriteService.deleteServiceFavorite(req.getEmployeeId(), req.getServiceId()));
    }

    /**
     * Get Favorite
     *
     * @param req : employeeId
     * @return data
     */
    @PostMapping(path = "/get-service-favorite", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetServiceFavoriteOutDTO> getServiceFavorite(@RequestBody GetServiceFavoriteRequest req) {
        return ResponseEntity.ok(menuFavoriteService.getServiceFavorite(req.getEmployeeId()));
    }
}
