package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.PermissionService;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.data.PermissionImportDto;
import com.viettel.vtpgw.persistence.dto.model.PermissionDto;
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
import java.io.IOException;
import java.util.Optional;

@Controller
@RequestMapping("/permission")
public class PermissionController {

    private static Logger logger = LoggerFactory.getLogger(PermissionController.class);

    @Autowired
    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    private PermissionService permissionService;

    @GetMapping("")
    public String index() {
        return "permission";
    }

    @ResponseBody
    @PostMapping("/add")
    public ResultDto<PermissionDto> createPermission(@Validated(value = Add.class) @RequestBody PermissionDto dto) {
        return permissionService.add(dto);
    }

    @PostMapping("/update")
    @ResponseBody
    public ResultDto<PermissionDto> update(@Validated(value = Update.class) @RequestBody PermissionDto dto) {
        return permissionService.update(dto);
    }

    @GetMapping("/findById")
    @ResponseBody
    public ResultDto<PermissionDto> findById(@RequestParam("id") Long id) {
        return permissionService.findById(id);
    }

    @GetMapping("/search")
    @ResponseBody
    public ArrayResultDto<PermissionDto> search(@RequestParam("keyword") String keyword,
                                                @RequestParam("page") Optional<Integer> page,
                                                @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return permissionService.search(keyword, currentPage, size);
    }

    @ResponseBody
    @GetMapping("/list")
    public ArrayResultDto<PermissionDto> findAll(@RequestParam("page") Optional<Integer> page,
                                                 @RequestParam("pageSize") Optional<Integer> pageSize) {
        Integer currentPage = page.orElse(1);
        Integer size = pageSize.orElse(10);
        return permissionService.findAll(currentPage, size);
    }

    @PostMapping("/import")
    @ResponseBody
    public ResultDto<Integer> importExternalRecord(@Valid @RequestBody ImportDto<PermissionImportDto> importDto) throws IOException {
        int size = permissionService.importPermission(importDto);
        ResultDto<Integer> resultDto = new ResultDto<>();
        resultDto.setSuccess();
        resultDto.setData(size);
        return resultDto;
    }
}
