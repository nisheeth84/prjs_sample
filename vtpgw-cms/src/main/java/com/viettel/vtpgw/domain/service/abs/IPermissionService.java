package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.model.PermissionDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

public interface IPermissionService {
    ArrayResultDto<PermissionDto> findAll(Integer page, Integer pageSize);
    ResultDto<PermissionDto> findById(Long id);
    ResultDto<PermissionDto> update(PermissionDto dto);
    ResultDto<PermissionDto> add(PermissionDto dto);
    ArrayResultDto<PermissionDto> search(String keyword, Integer page, Integer pageSize);
}
