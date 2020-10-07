package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ValidateResponse;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Validate common
 * 
 * @author nguyentrunghieu
 */
@RestController
@RequestMapping("/api")
public class ValidateResource {
    @Autowired
    private ValidateService validateService;

    /**
     * Validate common
     * 
     * @param request
     * @return List error
     */
    @PostMapping(path = "/validate", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ValidateResponse> validate(@RequestBody ValidateRequest request) {
        List<Map<String, Object>> errors = validateService.validate(request.getRequestData());
        int status = (errors == null || errors.isEmpty()) ? Constants.RESPONSE_SUCCESS : Constants.RESPONSE_FAILED;
        return ResponseEntity.ok(new ValidateResponse(errors, status));
    }
}
