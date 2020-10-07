package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersListFavouritesService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.ToListFavouriteRequest;

/**
 * CustomersListFavouritesResource
 */
@RestController
@RequestMapping("/api")
public class CustomersListFavouritesResource {

    @Autowired
    private CustomersListFavouritesService customersListFavouritesService;

    /**
     * addToListFavourite : add customer to List favourite
     *
     * @pram customerListId : param get from request
     * @return Long : customerListFavouriteId added
     */
    @PostMapping(path = "/add-to-list-favourite", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> addToListFavourite(@RequestBody ToListFavouriteRequest request) {
        return ResponseEntity.ok(customersListFavouritesService.addToListFavourite(request.getCustomerListId()));
    }

    /**
     * removeFavouriteList
     *
     * @pram customerListId : customerListId get from request
     * @return Long customerListId deleted
     */
    @PostMapping(path = "/remove-favourite-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> removeFavouriteList(@RequestBody ToListFavouriteRequest request) {
        return ResponseEntity.ok(customersListFavouritesService.removeFavouriteList(request.getCustomerListId()));
    }

}
