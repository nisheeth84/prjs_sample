package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;
import java.util.concurrent.TimeUnit;
import jp.co.softbrain.esales.commons.service.TimezonesService;
import jp.co.softbrain.esales.commons.service.dto.TimezonesDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetTimezonesResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * TimezonesQuery class process GraphQL query
 *
 */
@RestController
@RequestMapping("/api")
public class TimezonesResource {
    @Autowired
    private TimezonesService timezonesService;

    /**
     * get Timezones
     *
     * @return TimezonesDTO list
     */
    @PostMapping(path = "/get-timezones", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetTimezonesResponse> getTimezones() {
        List<TimezonesDTO> timezones = timezonesService.findAllDisplayOrder();
        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(3600, TimeUnit.SECONDS))
                .body(new GetTimezonesResponse(timezones));
    }
}
