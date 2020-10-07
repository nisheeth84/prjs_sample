package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.TabsInfoService;
import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetTabsInfoRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetTabsInfoResponse;

/**
 * Get TabsInfo Query
 * 
 * @author buithingocanh
 */
@RestController
@RequestMapping("/api")
public class GetTabsInfoResource {
    @Autowired
    private TabsInfoService tabsInfoService;

    /**
     * Get tabs info
     * 
     * @param tabBelong Tab belong
     * @return
     */
    @PostMapping(path = "/get-tabs-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetTabsInfoResponse> getTabsInfo(@RequestBody GetTabsInfoRequest request) {
        List<TabsInfoDTO> tabsInfo = tabsInfoService.getTabsInfo(request.getTabBelong());
        return ResponseEntity.ok(new GetTabsInfoResponse(tabsInfo));
    }
}
