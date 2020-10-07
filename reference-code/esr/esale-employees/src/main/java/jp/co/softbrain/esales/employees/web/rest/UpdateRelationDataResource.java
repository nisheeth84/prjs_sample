
package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.RelationDataInfosInDTO;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataRequest;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataResponse;

/**
 * @author chu ngoc hai
 */
@RestController
@RequestMapping("/api")
public class UpdateRelationDataResource {

    @Autowired
    private EmployeesService employeesService;
    
    @Autowired
    private TmsService tmsService;

    /**
     * create product
     *
     * @param data info product
     * @return id product
     */
    @PostMapping(path = "/update-relation-data", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateRelationDataResponse> updateRelationData(@RequestBody UpdateRelationDataRequest req) {
        Long recordId = req.getRecordId();   
        List<RelationDataInfosInDTO> relationDataInfos = req.getRelationDataInfos();
        UpdateRelationDataResponse res = new UpdateRelationDataResponse();
        String transID = "";
        boolean startNewTransation = false; 
        try {
            if (StringUtil.isEmpty(req.getTransID())) { 
                transID = tmsService.startTransaction();
                startNewTransation = true;
            }   else {
                transID = req.getTransID();
            }
            TransIDHolder.setTransID(transID);
            List<Long> updateRecordIds = employeesService.updateRelationData(recordId, relationDataInfos);
            res.setUpdateRecordIds(updateRecordIds);
            if (startNewTransation && !StringUtil.isEmpty(transID)) {
                tmsService.endTransaction(transID);
            }
        } catch (CustomRestException exception) {
            if (startNewTransation && !StringUtil.isEmpty(transID)) {
                tmsService.rollbackTransaction(transID);
            }
            res.setErrorAttributes(exception.getExtensions());
        } finally {
            TransIDHolder.removeTransID();
        }
        return ResponseEntity.ok(res);
    }

}
