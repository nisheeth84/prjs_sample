package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.DataChangeService;
import jp.co.softbrain.esales.commons.service.dto.DataChangeDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateDataChangeElasticSearchRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.DeleteDataChangeElasticSearchRequest;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;

/**
 * DataElasticSearchQuery class process GraphQL query
 *
 */
@RestController
@RequestMapping("/api")
public class DataChangeResource {

    public static final String MSG_REQUIRED = "Not input required field";
    public static final String ACTION_FIELD = "action";
    public static final String EXTENSION_BELONG_FIELD = "extensionBelong";
    public static final String DATA_ID_FIELD = "dataIds";
    public static final String DATA_CHANGE_ID_FIELD = "dataChangeIds";

    @Autowired
    private DataChangeService dataChangeService;

    /**
     * get all data change
     * 
     * @return
     */
    @PostMapping(path = "/get-data-change-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DataChangeDTO>> getDataChangeElasticSearch() {
        return ResponseEntity.ok(dataChangeService.findAll());
    }

    /**
     * create data change
     * 
     * @param extensionBelong
     * @param dataIds
     * @param action
     * @return
     */
    @PostMapping(path = "/create-data-change-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Long>> createDataChangeElasticSearch(
            @RequestBody CreateDataChangeElasticSearchRequest request) {
        // validate input
        if (request.getExtensionBelong() == null) {
            throw new CustomException(MSG_REQUIRED, EXTENSION_BELONG_FIELD, Constants.RIQUIRED_CODE);
        }
        if (request.getDataIds() == null || request.getDataIds().isEmpty()) {
            throw new CustomException(MSG_REQUIRED, DATA_ID_FIELD, Constants.RIQUIRED_CODE);
        }
        if (request.getAction() == null) {
            throw new CustomException(MSG_REQUIRED, ACTION_FIELD, Constants.RIQUIRED_CODE);
        }

        return ResponseEntity.ok(dataChangeService.createDataChange(request.getExtensionBelong(), request.getDataIds(),
                request.getAction()));
    }

    /**
     * Delete all data_change with dataChangeIds specified in
     * {@code dataChangeIds} parameter
     */

    /**
     * Delete all data_change with dataChangeIds specified in
     * {@code dataChangeIds} parameter
     * 
     * @return
     */
    @PostMapping(path = "/delete-data-change-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> deleteDataChangeElasticSearch(
            @RequestBody DeleteDataChangeElasticSearchRequest request) {
        // validate input
        if (request.getDataChangeIds() == null || request.getDataChangeIds().isEmpty()) {
            throw new CustomException(MSG_REQUIRED, DATA_CHANGE_ID_FIELD, Constants.RIQUIRED_CODE);
        }
        return ResponseEntity.ok(dataChangeService.deleteDataChange(request.getDataChangeIds()));
    }
}
