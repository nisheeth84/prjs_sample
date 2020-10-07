package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.AddressService;
import jp.co.softbrain.esales.commons.service.dto.AddressDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetAddressesFromZipCodeRequest;

/**
 * Get address information from the zip code
 * 
 * @author chungochai
 */
@RestController
@RequestMapping("/api")
public class GetAddressesFromZipCodeResource {
    @Autowired
    private AddressService addressesService;

    /**
     * Get list address information from the zip code
     * 
     * @param zipCode : data need for get information
     * @param offset : data need for get information
     * @param limit : data need for get information
     * @return address information from the zip code
     */
    @PostMapping(path = "/get-addresses-from-zip-code", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AddressDTO>> getAddressesFromZipCode(
            @RequestBody GetAddressesFromZipCodeRequest request) {
        return ResponseEntity.ok(addressesService.getAddressesFromZipCode(request.getZipCode(), request.getOffset(),
                request.getLimit()));
    }
}
