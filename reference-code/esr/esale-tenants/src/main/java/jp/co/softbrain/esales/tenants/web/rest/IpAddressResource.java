package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.IpAddressService;
import jp.co.softbrain.esales.tenants.service.dto.CheckAccessIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdatedIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.CheckAccessIpAddressesRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateIpAddressesRequest;

@RestController
public class IpAddressResource {

    @Autowired
    IpAddressService ipAddressService;

    /**
     * getIpAddresses : get IP Address
     *
     * @return GetIpAddressesOutDTO : DTO out for API getIpAddresses
     */
    @PostMapping(path = "/api/get-ip-addresses", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetIpAddressesOutDTO> getIpAddresses() {
        return ResponseEntity.ok(ipAddressService.getIpAddresses());
    }

    /**
     * checkAccessIpAddresses : check access ip addresses
     *
     * @param request : request parameter
     * @return CheckAccessIpAddressesOutDTO : DTO out for API checkAccessIpAddresses
     */
    @PostMapping(path = "/public/api/check-access-ip-addresses", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CheckAccessIpAddressesOutDTO> checkAccessIpAddresses(@RequestBody CheckAccessIpAddressesRequest request) {
        return ResponseEntity.ok(ipAddressService.checkAccessIpAddresses(request.getIpAddress()));
    }

    /**
     * updateIpAddresses : update or insert IpAddress
     * @param request : request parameter
     * @return UpdatedIpAddressesOutDTO : DTO out for API updateIpAddresses
     */
    @PostMapping(path = "/api/update-ip-addresses", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdatedIpAddressesOutDTO> updateIpAddresses(@RequestBody UpdateIpAddressesRequest request) {
        return ResponseEntity.ok(ipAddressService.updateIpAddresses(request.getIpAddresses(), request.getDeletedIpAddresses()));
    }
}
