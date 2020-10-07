package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.domain.service.abs.IAccountService;
import com.viettel.vtpgw.persistence.dto.data.AccountImportDto;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.model.AccountDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.entity.AccountEntity;
import com.viettel.vtpgw.persistence.repository.IAccountRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountService extends BaseService implements IAccountService {

    private static Logger logger = LoggerFactory.getLogger(AccountService.class);
    private IAccountRepository iAccountRepository;

    @Autowired
    public AccountService(IAccountRepository iAccountRepository, ModelMapper modelMapper) {
        super(modelMapper);
        this.iAccountRepository = iAccountRepository;
    }

    @Override
    public ArrayResultDto<AccountDto> findAll(Integer page, Integer pageSize) {
        ArrayResultDto<AccountDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<AccountDto> rawData = iAccountRepository.findAllByOrderByIdDesc(pageable)
                .map(account -> super.map(account, AccountDto.class));
        result.setSuccess(rawData);
        return result;
    }

    @Override
    public ResultDto<AccountDto> findById(Long id) {
        ResultDto<AccountDto> resultDto = new ResultDto<>();
        return iAccountRepository.findById(id)
                .map(account -> {
                    AccountDto accountDto = super.map(account, AccountDto.class);
                    resultDto.setSuccess(accountDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    @Override
    public ResultDto<AccountDto> update(AccountDto accountDto) {
        ResultDto<AccountDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        return iAccountRepository.findById(accountDto.getId())
                .map(account -> {
                    super.map(accountDto, account);
                    account.setUpdatedDate(Instant.now());
                    account.setUpdatedBy(email);
                    iAccountRepository.save(account);
                    resultDto.setSuccess(accountDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    @Override
    public ResultDto<AccountDto> add(AccountDto accountDto) {
        ResultDto<AccountDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        String salt = BCrypt.gensalt();
        if (!checkExistEmail(accountDto.getEmail())) {
            AccountEntity account = super.map(accountDto, AccountEntity.class);
            account.setAccountId(String.valueOf(UUID.randomUUID()));
            account.setPassword(BCrypt.hashpw(accountDto.getPassword(), salt));
            account.setCreatedBy(email);
            account.setSalt(salt);
            account.setCreatedDate(Instant.now());
            iAccountRepository.save(account);
            resultDto.setSuccess(accountDto);
            return resultDto;
        } else {
            resultDto.setError();
            return resultDto;
        }
    }

    @Override
    public ArrayResultDto<AccountDto> findByEmailOrPhoneOrFullname(String keyword, Integer page, Integer pageSize) {

        ArrayResultDto<AccountDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<AccountDto> rawData = iAccountRepository.findByEmailContainingOrFullnameContainingOrPhoneContaining(keyword, keyword, keyword, pageable)
                .map(service -> (super.map(service, AccountDto.class)));
        if (rawData.hasContent()) {
            result.setSuccess(rawData);
        } else {
            result.setItemNotfound();
        }
        return result;
    }

    @Override
    public boolean checkExistEmail(String email) {
        AccountEntity account = iAccountRepository.findByEmail(email);
        return !Objects.isNull(account);
    }

    public int importAccount(ImportDto<AccountImportDto> importDto) {
        List<AccountEntity> list = importDto.getRecords()
                .stream()
                .map(acd -> {
                    AccountEntity entity = super.map(acd, AccountEntity.class);
                    entity.setId(null);
                    entity.setAccountId(StringUtils.isEmpty(acd.getId()) ? UUID.randomUUID().toString() : acd.getId());
                    fetchDate(entity, acd);
                    return entity;
                })
                .collect(Collectors.toList());
        return iAccountRepository.saveAll(list).size();
    }

    private void fetchDate(AccountEntity account, AccountImportDto accountImportDto) {
        if (Optional.ofNullable(accountImportDto.getCreatedDate()).isPresent()) {
            account.setCreatedDate(accountImportDto.getCreatedDate().toInstant());
        }
        if (Optional.ofNullable(accountImportDto.getUpdatedDate()).isPresent()) {
            account.setUpdatedDate(accountImportDto.getUpdatedDate().toInstant());
        }
    }

}
