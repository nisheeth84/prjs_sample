package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.model.ApplicationDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

public interface IApplicationService {
    ArrayResultDto<ApplicationDto> findAll(Integer page, Integer pageSize);
    ResultDto<ApplicationDto> findById(Long id);
    ResultDto<ApplicationDto> update(ApplicationDto applicationDto);
    ResultDto<ApplicationDto> add(ApplicationDto applicationDto);
    ArrayResultDto<ApplicationDto> search(String keyword, Integer page, Integer pageSize);
}
