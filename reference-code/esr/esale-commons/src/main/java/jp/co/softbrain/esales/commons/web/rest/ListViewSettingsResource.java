package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.ListViewSettingsService;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetInitializeListInfoRequest;

/**
 * ListViewSettingsQuery class process GraphQL query
 * 
 * @author TranTheDuy
 */
@RestController
@RequestMapping("/api")
public class ListViewSettingsResource {

    @Autowired
    private ListViewSettingsService listViewSettingsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Get initialize list info
     * 
     * @param fieldBelong fieldBelong
     * @return information create list screen.
     */
    @PostMapping(path = "/get-initialize-list-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetInitializeListInfoOutDTO> getInitializeListInfo(
            @RequestBody GetInitializeListInfoRequest request) {
        return ResponseEntity.ok(listViewSettingsService.getInitializeListInfo(request.getFieldBelong(),
                jwtTokenUtil.getEmployeeIdFromToken(), jwtTokenUtil.getLanguageCodeFromToken()));
    }
}
