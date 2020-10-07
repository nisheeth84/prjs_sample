package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.request.ContactUpdateDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.model.ContactDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

import java.util.List;

public interface IContactService {
	ArrayResultDto<ContactDto> findAll(Integer page, Integer pageSize);
    ResultDto<ContactDto> findById(String id);
    ResultDto<ContactUpdateDto> update(ContactUpdateDto contactDto);
    ResultDto<ContactDto> add(ContactDto contactDto);
    ArrayResultDto<ContactDto> findByEmailOrPhoneOrFullname(String keyword, Integer page, Integer pageSize);
    List<ContactDto> findAll();
    boolean checkExistEmail(String email);
}
