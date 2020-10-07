package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.DatabaseStorageService;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateUsageStorageRequest;
import jp.co.softbrain.esales.tenants.service.dto.GetDatabaseStorageResponseDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.UpdateUsageStorageResponse;

/**
 * REST-ful Controller to handle check database storage.
 *
 * @author nguyenvietloi
 */
@RestController
public class DatabaseStorageController {

    @Autowired
    private DatabaseStorageService databaseStorageService;

    /**
     * Get database storage
     *
     * @param contractTenantId param contractTenantId
     * @return {@link GetDatabaseStorageResponseDTO}
     */
    @GetMapping(path = "/public/api/get-database-storage", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetDatabaseStorageResponseDTO> getDatabaseStorage(@RequestParam("contractTenantId") String contractTenantId) {
        return ResponseEntity.ok(databaseStorageService.getDatabaseStorage(contractTenantId));
    }

    /**
     * Update usage storage
     *
     * @param request request
     * @return {@link UpdateUsageStorageResponse}
     */
    @PostMapping(path = "/api/update-usage-storage", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateUsageStorageResponse> updateUsageStorage(
            @RequestBody UpdateUsageStorageRequest request) {
        UpdateUsageStorageResponse response = new UpdateUsageStorageResponse();
        response.setUpdateUsageStorageResponses(databaseStorageService.updateUsageStorage(request.getTenantIds()));
        return ResponseEntity.ok(response);
    }
}
