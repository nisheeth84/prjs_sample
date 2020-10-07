package com.viettel.vtpgw.ws.communication;

import com.viettel.vtpgw.persistence.dto.model.ApplicationDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import org.springframework.ui.Model;

import java.util.Optional;

public interface IApplicationController {
    ResultDto<ApplicationDto> add(ApplicationDto dto);

    ResultDto<ApplicationDto> update(ApplicationDto updateDto);

    ResultDto<ApplicationDto> findById(Long id);

    ArrayResultDto<ApplicationDto> search(String keyword, Optional<Integer> page, Optional<Integer> pageSize);

    ArrayResultDto<ApplicationDto> findAll(Optional<Integer> page, Optional<Integer> pageSize);

//    String index();

    String index(Model model);
}
