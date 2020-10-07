package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersListMembersService;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToAutoListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToListOutSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMemberIdsDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.AddCustomersToAutoListRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.AddCustomersToListRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.DeleteCustomerOutOfListRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.MoveCustomersToOtherListRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerListIdOutResponse;

/**
 * CustomersListMembersResource
 */
@RestController
@RequestMapping("/api")
public class CustomersListMembersResource {

    @Autowired
    private CustomersListMembersService customersListMembersService;

    /**
     * @param request
     * @return
     */
    @PostMapping(path = "/refresh-auto-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AddCustomersToAutoListOutDTO> refreshAutoList(
            @RequestBody AddCustomersToAutoListRequest request) {
        return ResponseEntity.ok(customersListMembersService.refreshAutoList(request.getIdOfList()));
    }

    /**
     * @param request
     * @return
     */
    @PostMapping(path = "/delete-customer-out-of-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerListIdOutResponse> deleteCustomerOutOfList(
            @RequestBody DeleteCustomerOutOfListRequest request) {
        return ResponseEntity.ok(customersListMembersService.deleteCustomerOutOfList(request.getCustomerListId(),
                request.getCustomerIds()));
    }

    /**
     * moveCustomersToOtherList
     * 
     * @param request
     * @return
     */
    @PostMapping(path = "/move-customers-to-other-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomersListMemberIdsDTO> moveCustomersToOtherList(
            @RequestBody MoveCustomersToOtherListRequest request) {
        return ResponseEntity.ok(customersListMembersService.moveCustomersToOtherList(request.getSourceListId(),
                request.getDestListId(), request.getCustomerIds()));
    }

    /**
     * Add customers from list id to list
     * 
     * @param idList - id of the destination list
     * @param customerIds - list of customers
     * @return object contains response
     */
    @PostMapping(path = "/add-customers-to-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AddCustomersToListOutSubType1DTO> addCustomersToList(
            @RequestBody AddCustomersToListRequest request) {
        return ResponseEntity.ok(
                customersListMembersService.addCustomersToList(request.getCustomerListId(), request.getCustomerIds()));
    }
}
