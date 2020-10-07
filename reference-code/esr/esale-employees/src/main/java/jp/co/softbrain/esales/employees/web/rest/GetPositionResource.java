package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.PositionsService;
import jp.co.softbrain.esales.employees.service.dto.GetPositionsOutDTO;

/**
 * GetPositionQuery class process GraphQL query for GetPositionQuery
 *
 * @author QuangLV
 */
@RestController
@RequestMapping("/api")
public class GetPositionResource {

    @Autowired
    private PositionsService positionsService;

    /**
     * get Positions : get all Positions sort by position id ASC
     *
     * @return GetPositionsOutDTO : list DTO out of API getPositions
     */
    @PostMapping(path = "/get-positions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetPositionsOutDTO> getPositions() {
        return ResponseEntity.ok(positionsService.getPositions());
    }
}
