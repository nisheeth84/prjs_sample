package com.viettel.vtpgw.ws.communication;

import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.dto.model.ServiceDto;

import java.util.Optional;

public interface IServiceController {
    ResultDto<ServiceDto> add(ServiceDto dto);

    ResultDto<ServiceDto> update(ServiceDto dto);

    ResultDto<ServiceDto> findById(String id);

    ArrayResultDto<ServiceDto> search(String keyword, Optional<Integer> page, Optional<Integer> pageSize);

    ArrayResultDto<ServiceDto> findAll(Optional<Integer> page, Optional<Integer> pageSize);

    String index();
}
