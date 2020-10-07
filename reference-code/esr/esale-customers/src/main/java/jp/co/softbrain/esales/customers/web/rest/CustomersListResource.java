package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService;
import jp.co.softbrain.esales.customers.service.CustomersListService;
import jp.co.softbrain.esales.customers.service.dto.CreateListInDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetListSearchConditionInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.InitializeListModalResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateListInDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateListOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.DeleteListRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetFavouriteCustomersRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetInitializeListModalRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetListSearchConditionInfoRequest;

/**
 * CustomersListResource
 */
@RestController
@RequestMapping("/api")
public class CustomersListResource {

    @Autowired
    private CustomersListService customersListService;

    @Autowired
    private CustomersListSearchConditionsService customersListSearchConditionsService;

    /**
     * deleteList
     *
     * @pram customerListId : customerListId get from request
     * @return Long : customerListId deleted
     */
    @PostMapping(path = "/delete-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> deleteList(@RequestBody DeleteListRequest req) {
        return ResponseEntity.ok(customersListService.deleteList(req.getCustomerListId()));
    }

    /**
     * Create list
     * 
     * @param idList id of the destination list
     * @param customerIds list of customers
     * @return object contains response
     */
    @PostMapping(path = "/create-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateListOutDTO> createList(@RequestBody CreateListInDTO listParams) {
        CreateListOutDTO response = customersListService.createList(listParams);
        return ResponseEntity.ok(response);
    }

    /**
     * Update list
     * 
     * @param listParams param info in
     * @return the object info out
     */
    @PostMapping(path = "/update-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateListOutDTO> updateList(@RequestBody UpdateListInDTO listParams) {
        return ResponseEntity.ok(customersListService.updateList(listParams));
    }

    /**
     * Get the list of favorite customers
     * 
     * @param customerListFavouriteId Favorite group list
     * @return the entity
     */
    @PostMapping(path = "/get-favorite-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFavoriteCustomersOutDTO> getFavoriteCustomers(
            @RequestBody GetFavouriteCustomersRequest request) {
        return ResponseEntity.ok(customersListService.getFavoriteCustomers(request.getCustomerListFavouriteIds(),
                request.getEmployeeId()));
    }

    /**
     * Get information to display Initialize List Modal
     * 
     * @param customerListId - the id of customers list
     * @param isAutoList - is auto list
     * @return the response DTO
     */
    @PostMapping(path = "/get-initialize-list-modal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeListModalResponseDTO> getInitializeListModal(
            @RequestBody GetInitializeListModalRequest request) {
        InitializeListModalResponseDTO response = customersListService
                .getInitializeListModal(request.getCustomerListId(), request.getIsAutoList());
        return ResponseEntity.ok(response);
    }

    /**
     * Get list search condition info
     * 
     * @param request
     * @return information for auto list
     */
    @PostMapping(path = "/get-list-search-condition-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetListSearchConditionInfoResponse> getListSearchConditionInfo(
            @RequestBody GetListSearchConditionInfoRequest request) {
        GetListSearchConditionInfoResponse response = customersListSearchConditionsService
                .getListSearchConditionInfo(request.getListId());
        return ResponseEntity.ok(response);
    }
}
