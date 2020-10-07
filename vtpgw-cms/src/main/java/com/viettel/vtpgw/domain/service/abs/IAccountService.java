package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.data.AccountImportDto;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.model.AccountDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

import java.util.List;

public interface IAccountService {
    ArrayResultDto<AccountDto> findAll(Integer page, Integer pageSize);
    ResultDto<AccountDto> findById(Long id);
    ResultDto<AccountDto> update(AccountDto accountDto);
    ResultDto<AccountDto> add(AccountDto accountDto);
    ArrayResultDto<AccountDto> findByEmailOrPhoneOrFullname(String keyword, Integer page, Integer pageSize);
//    List<AccountDto> findAll();
    boolean checkExistEmail(String email);
    int importAccount(ImportDto<AccountImportDto> accountImportDto);

}
