package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ReportDto;

import java.util.Date;

public interface IReportService {
    ArrayResultDto<ReportDto> findAll(Integer page, Integer pageSize);

    ReportDto searchReportByServiceNameAndAppId(String keyword, String keyword2);

    ArrayResultDto<ReportDto> searchReportByServiceNameAndNodeUrl(String keyword, String nodeUrl, Integer page, Integer pageSize);

    ArrayResultDto<ReportDto> searchReportByServiceNameAndTime(String keyword, Date startDate, Date endDate, Integer page, Integer pageSize);
}
