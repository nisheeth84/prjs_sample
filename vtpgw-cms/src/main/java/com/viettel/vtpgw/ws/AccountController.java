package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.AccountService;
import com.viettel.vtpgw.persistence.dto.data.AccountImportDto;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.model.AccountDto;
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
@RequestMapping("/account")
public class AccountController {

    private static Logger logger = LoggerFactory.getLogger(AccountController.class);
    private AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("")
    public String index() {
        return "account";
    }

    @GetMapping("/list")
    @ResponseBody
    public ArrayResultDto<AccountDto> getPage(@RequestParam("page") Optional<Integer> page,
                                              @RequestParam("size") Optional<Integer> size) {
        Integer currentPage = page.orElse(1);
        Integer pageSize = size.orElse(2);
        return accountService.findAll(currentPage, pageSize);
    }

    @GetMapping("/search")
    @ResponseBody
    public ArrayResultDto<AccountDto> findByEmailOrPhoneOrFullname(@RequestParam("keyword") String keyword,
                                                                   @RequestParam("page") Optional<Integer> page,
                                                                   @RequestParam("size") Optional<Integer> size) {
        Integer currentPage = page.orElse(1);
        Integer pageSize = size.orElse(2);
        return accountService.findByEmailOrPhoneOrFullname(keyword.trim(), currentPage, pageSize);
    }

    @PostMapping("/add")
    @ResponseBody
    public ResultDto<AccountDto> createAccount(@Validated(value = Add.class) @RequestBody AccountDto account) {
        return accountService.add(account);
    }

    @PostMapping("/update")
    @ResponseBody
    public ResultDto<AccountDto> updateAccount(@Validated(value = Update.class) @RequestBody AccountDto account) {
        return accountService.update(account);
    }

    @GetMapping("/findById")
    @ResponseBody
    public ResultDto<AccountDto> findById(@RequestParam("id") Long id) {
        return accountService.findById(id);
    }

    @PostMapping("/import")
    @ResponseBody
    public ResultDto<Integer> importExternalRecord(@Valid @RequestBody ImportDto<AccountImportDto> importDto) throws IOException {
        int size = accountService.importAccount(importDto);
        ResultDto<Integer> resultDto = new ResultDto<>();
        resultDto.setSuccess();
        resultDto.setData(size);
        return resultDto;
    }

    @GetMapping("checkExistEmail")
    @ResponseBody
    public boolean checkExistEmail(@RequestParam String email) {
        return accountService.checkExistEmail(email);
    }
}
