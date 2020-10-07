package com.viettel.vtpgw.ws.communication;

import com.viettel.vtpgw.persistence.dto.model.AccountDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

import java.util.Optional;

public interface IAccountController {

    ResultDto<AccountDto> createAccount(AccountDto account);

    ResultDto<AccountDto> updateAccount(AccountDto account);

    ResultDto<AccountDto> findById(Long id);

    ArrayResultDto<AccountDto> findByEmailOrPhoneOrFullname(String keyword, Optional<Integer> page, Optional<Integer> size);

    ArrayResultDto<AccountDto> getPage(Optional<Integer> page, Optional<Integer> size);

    String index();
}
