package jp.co.softbrain.esales.tenants.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.MigrateDataService;
import jp.co.softbrain.esales.tenants.service.dto.MigrateDataResult;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.MigrateDataRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.MigrateDataResponse;

/**
 * Spring MVC RESTful Controller to handle migration data
 *
 * @author tongminhcuong
 */
@RestController
@RequestMapping("/api")
public class MigrateDataController {

    @Autowired
    private MigrateDataService migrateDataService;

    /**
     * Setting environment when created a tenant
     *
     * @param request Tenant info (tenant Id, language id)
     * @return The message after setting process
     */
    @PostMapping(path = "/migrate-data", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MigrateDataResponse> migrateData(@RequestBody MigrateDataRequest request) {

        List<MigrateDataResult> migrateDataResultList = migrateDataService.migrateData(request.getMicroServiceName());
        return ResponseEntity.ok(new MigrateDataResponse(migrateDataResultList));
    }
}
