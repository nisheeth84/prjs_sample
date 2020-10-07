package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.FeedBackStatusService;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackStatusOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetFeedBackStatusOutDTO;
import jp.co.softbrain.esales.tenants.tenant.util.JwtTokenUtil;

/**
 * FeedBackStatusResource
 * 
 * @author DatDV
 */
@RestController
@RequestMapping("/api")
public class FeedBackStatusResource {

    @Autowired
    private FeedBackStatusService feedBackStatusService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * createFeedBackStatusOpen
     * 
     * @return CreateFeedBackStatusOutDTO : DTO out of API
     *         createFeedBackStatusOpen
     */
    @PostMapping(path = "/create-feed-back-status-open", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateFeedBackStatusOutDTO> createFeedBackStatusOpen() {
        return ResponseEntity.ok(feedBackStatusService.createFeedBackStatusOpen(jwtTokenUtil.getEmployeeIdFromToken(),
                jwtTokenUtil.getTenantIdFromToken()));
    }

    /**
     * createFeedBackStatusOpen
     * 
     * @return GetFeedBackStatusOutDTO : DTO out of API getFeedBackStatusOpen
     */
    @PostMapping(path = "/get-feed-back-status-open", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFeedBackStatusOutDTO> getFeedBackStatusOpen() {
        return ResponseEntity.ok(feedBackStatusService.getFeedBackStatusOpen(jwtTokenUtil.getEmployeeIdFromToken(),
                jwtTokenUtil.getTenantIdFromToken()));
    }
}
