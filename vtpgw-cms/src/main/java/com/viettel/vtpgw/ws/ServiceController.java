package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.ServiceService;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.data.ServiceImportDto;
import com.viettel.vtpgw.persistence.dto.model.ServiceDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.validator.group.Add;
import com.viettel.vtpgw.validator.group.Update;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
import java.util.Optional;

@Controller
@RequestMapping("/service")
public class ServiceController {

    private static Logger logger = LoggerFactory.getLogger(ServiceController.class);
    private ServiceService serviceService;

    @Autowired
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping("/add")
    @ResponseBody
    public ResultDto<ServiceDto> add(@Validated(value = Add.class) @RequestBody ServiceDto dto) {
        return serviceService.add(dto);
    }

    @PostMapping("/update")
    @ResponseBody
    public ResultDto<ServiceDto> update(@Validated(value = Update.class) @RequestBody ServiceDto dto) {
        return serviceService.update(dto);
    }

    @GetMapping("/findById")
    @ResponseBody
    public ResultDto<ServiceDto> findById(@RequestParam("id") Long id) {
        return serviceService.findById(id);
    }

    @GetMapping("/search")
    @ResponseBody
    public ArrayResultDto<ServiceDto> search(@RequestParam("keyword") String keyword,
                                             @RequestParam("page") Optional<Integer> page,
                                             @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return serviceService.search(keyword.trim(), currentPage, size);
    }

    @GetMapping("/list")
    @ResponseBody
    public ArrayResultDto<ServiceDto> findAll(@RequestParam("page") Optional<Integer> page,
                                              @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return serviceService.findAll(currentPage, size);
    }

    @GetMapping("")
    public String index() {
        return "service";
    }

    @PostMapping("/import")
    @ResponseBody
    public ResultDto<Integer> importExternalRecord(@Valid @RequestBody ImportDto<ServiceImportDto> importDto) {
        int size = serviceService.importService(importDto);
        ResultDto<Integer> resultDto = new ResultDto<>();
        resultDto.setSuccess();
        resultDto.setData(size);
        return resultDto;
    }

    @GetMapping("/checkExistName")
    @ResponseBody
    public boolean checkExistName(@RequestParam String name) {
        return serviceService.checkExistName(name);
    }
}

