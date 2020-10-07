package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.ApplicationService;
import com.viettel.vtpgw.domain.service.ContactService;
import com.viettel.vtpgw.persistence.dto.data.ApplicationImportDto;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.model.ApplicationDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.validator.group.Add;
import com.viettel.vtpgw.validator.group.Update;
import com.viettel.vtpgw.ws.communication.IApplicationController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Optional;

@RequestMapping("/application")
@Controller
public class ApplicationController {

    private static Logger logger = LoggerFactory.getLogger(ApplicationController.class);
    private ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/add")
    @ResponseBody
    public ResultDto<ApplicationDto> add(@Validated(value = Add.class) @RequestBody ApplicationDto dto) {
        return applicationService.add(dto);
    }

    @PostMapping("/update")
    @ResponseBody
    public ResultDto<ApplicationDto> update(@Validated(value = Update.class) @RequestBody ApplicationDto updateDto) {
        return applicationService.update(updateDto);
    }

    @GetMapping("/findById")
    @ResponseBody
    public ResultDto<ApplicationDto> findById(@RequestParam("id") Long id) {
        return applicationService.findById(id);
    }

    @GetMapping("/search")
    @ResponseBody
    public ArrayResultDto<ApplicationDto> search(@RequestParam("keyword") String keyword,
                                                 @RequestParam("page") Optional<Integer> page,
                                                 @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return applicationService.search(keyword, currentPage, size);
    }

    @GetMapping("/list")
    @ResponseBody
    public ArrayResultDto<ApplicationDto> findAll(@RequestParam("page") Optional<Integer> page,
                                                  @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return applicationService.findAll(currentPage, size);
    }

    @GetMapping("")
    public String index(Model model) {
        return "application";
    }

    @PostMapping("/import")
    @ResponseBody
    public ResultDto<Integer> importExternalRecord(@Valid @RequestBody ImportDto<ApplicationImportDto> importDto) throws IOException {
        int size = applicationService.importApplication(importDto);
        ResultDto<Integer> resultDto = new ResultDto<>();
        resultDto.setSuccess();
        resultDto.setData(size);
        return resultDto;
    }
}
