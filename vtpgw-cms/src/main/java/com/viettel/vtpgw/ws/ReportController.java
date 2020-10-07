package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.abs.IReportService;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ReportDto;
import com.viettel.vtpgw.ws.communication.IReportController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.Optional;

@RequestMapping("report")
@Controller
public class ReportController implements IReportController {

    @Autowired
    public ReportController(IReportService iReportService) {
        this.iReportService = iReportService;
    }

    private IReportService iReportService;

    @GetMapping("/list")
    @ResponseBody
    public ArrayResultDto<ReportDto> findAll(@RequestParam("page") Optional<Integer> page,
                                             @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return iReportService.findAll(currentPage, size);
    }

    @GetMapping("/searchByServiceNameAndNodeUrl")
    @ResponseBody
    public ArrayResultDto<ReportDto> findReportByServiceNameAndNodeUrl(
            @RequestParam("serviceName") String serviceName,
            @RequestParam("nodeUrl") String nodeUrl,
            @RequestParam("page") Optional<Integer> page,
            @RequestParam("pageSize") Optional<Integer> pageSize
    ) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return iReportService.searchReportByServiceNameAndNodeUrl(serviceName, nodeUrl, currentPage, size);
    }

    @Override
    @GetMapping("")
    public String index(Model model) {
        return "report";
    }

    @GetMapping("/search")
    @ResponseBody
    public ReportDto search(@RequestParam("serviceName") String serviceName,
                            @RequestParam("appId") String appId) {
        return iReportService.searchReportByServiceNameAndAppId(serviceName, appId);
    }

    @GetMapping("/search2")
    @ResponseBody
    public ArrayResultDto<ReportDto> search(@RequestParam("serviceName") String serviceName,
                                            @RequestParam(value = "startTime", required = false) Date startTime,
                                            @RequestParam(value = "endTime", required = false) Date endTime,
                                            @RequestParam("page") Optional<Integer> page,
                                            @RequestParam("pageSize") Optional<Integer> pageSize
    ) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);

        return iReportService.searchReportByServiceNameAndTime(serviceName, startTime, endTime, currentPage, size);
    }

//    @PostMapping("/import")
//    @ResponseBody
//    public ImportResultDto<ReportDto> importExternalRecord(@RequestBody List<ReportDto> reportDtos) throws IOException {
//        ImportResultDto<ReportDto> resultDto = new ImportResultDto<>();
//        for(ReportDto reportDto : reportDtos){
//            if (iReportService.add(reportDto).getStatusCode().equals("200")) {
//                resultDto.getDataSuccess().add(reportDto);
//            } else {
//                resultDto.getDataFail().add(reportDto);
//            }
//        }
//        if (!resultDto.getDataSuccess().isEmpty()) {
//            resultDto.setSuccess();
//        } else {
//            resultDto.setError();
//        }
//        return resultDto;
//    }
}
