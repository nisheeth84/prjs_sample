package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.dto.model.ServiceDto;

public interface IServiceService {
    ArrayResultDto<ServiceDto> findAll(Integer page, Integer pageSize);
    ResultDto<ServiceDto> findById(Long id);
    ResultDto<ServiceDto> update(ServiceDto dto);
    ResultDto<ServiceDto> add(ServiceDto dto);
    ArrayResultDto<ServiceDto> search(String keyword, Integer page, Integer pageSize);
    boolean checkExistName(String name);
}
