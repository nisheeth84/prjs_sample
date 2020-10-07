package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.FeedBackService;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackOutDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.CreateFeedBackRequest;

/**
 * FeedBackResource
 *
 * @author DatDV
 *
 */
@RestController
@RequestMapping("/api")
public class FeedBackResource {

    /**
     * feedBackService
     */
    @Autowired
    private FeedBackService feedBackService;

    /**
     * create Feed Back
     *
     * @param request : createFeedBackInDTO
     * @return CreateFeedBackOutDTO : DTO out of API createFeedBack
     */
    @PostMapping(path = "/create-feed-back", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateFeedBackOutDTO> createFeedBack(@RequestBody CreateFeedBackRequest request) {
        return ResponseEntity.ok(feedBackService.createFeedback(request.getCreateFeedBack()));
    }
}
