package com.viettel.vtpgw.ws.communication;

import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ReportDto;
import org.springframework.ui.Model;

import java.util.Optional;

public interface IReportController {

    ArrayResultDto<ReportDto> findAll(Optional<Integer> page, Optional<Integer> pageSize);

    String index(Model model);
}
