package com.viettel.vtpgw.ws.communication;

import com.viettel.vtpgw.persistence.dto.request.PermissionAddDto;
import com.viettel.vtpgw.persistence.dto.request.PermissionUpdateDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.model.PermissionDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

import java.util.Optional;

public interface IPermissionController {
    ResultDto<PermissionAddDto> createPermission(PermissionAddDto dto);

    ResultDto<PermissionUpdateDto> update(PermissionUpdateDto dto);

    ResultDto<PermissionDto> findById(Long id);

    ArrayResultDto<PermissionDto> search(String keyword, Optional<Integer> page, Optional<Integer> pageSize);

    ArrayResultDto<PermissionDto> findAll(Optional<Integer> page, Optional<Integer> pageSize);

    String index();
}
