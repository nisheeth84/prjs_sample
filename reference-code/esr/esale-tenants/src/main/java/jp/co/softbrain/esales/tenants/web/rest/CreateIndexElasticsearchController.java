package jp.co.softbrain.esales.tenants.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.elasticsearch.service.CreateElasticsearchIndexService;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.CreateIndexElasticsearchRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.CreateElasticsearchIndexResponse;

/**
 * Spring MVC RESTful Controller to handle Index elasticsearch.
 *
 * @author tongminhcuong
 */
@RestController
@RequestMapping("/api")
public class CreateIndexElasticsearchController {

    private final Logger log = LoggerFactory.getLogger(CreateIndexElasticsearchController.class);

    @Autowired
    private CreateElasticsearchIndexService createElasticsearchIndexService;

    /**
     * Indexing data sync elasticsearch
     *
     * @return String
     */
    @PostMapping(path = "/create-index-elasticsearch", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateElasticsearchIndexResponse> createIndexElasticsearch(
            @RequestBody CreateIndexElasticsearchRequest request) {
        try {
            createElasticsearchIndexService.callServiceAsync(request.getTenantName(), request.getExtensionBelong());
            return ResponseEntity.ok(new CreateElasticsearchIndexResponse("SyncIndexElasticsearch success"));
        } catch (Exception e) {
            String message = "Unexpected error occurred. Message: " + e.getMessage();
            log.error(message);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new CreateElasticsearchIndexResponse(message));
        }
    }
}
