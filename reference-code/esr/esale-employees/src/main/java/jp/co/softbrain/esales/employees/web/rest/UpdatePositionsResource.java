package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.PositionsService;
import jp.co.softbrain.esales.employees.service.dto.UpdatePositionsOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdatePositionsRequest;

/**
 * UpdatePositionsMutation: class GraphQL mutation for API updatePositions
 *
 * @author QuangLV
 */

@RestController
@RequestMapping("/api")
public class UpdatePositionsResource {

    @Autowired
    private PositionsService positionsService;

    /**
     * updatePositions : insert or update Positions
     *
     * @param positions : data insert or update Positions
     * @param deletedPositions : list position deleted
     * @return UpdatePositionsOutDTO : DTO out of API updatePositions
     */
    @PostMapping(path = "/update-positions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdatePositionsOutDTO> updatePositions(@RequestBody UpdatePositionsRequest req) {
        return ResponseEntity.ok(positionsService.updatePositions(req.getPositions(), req.getDeletedPositions()));
    }
}
