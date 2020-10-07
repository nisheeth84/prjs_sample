package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.domain.service.abs.IReportService;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ReportDto;
import com.viettel.vtpgw.persistence.entity.ReportEntity;
import com.viettel.vtpgw.persistence.repository.IReportRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ReportService extends BaseService implements IReportService {
    @Autowired
    public ReportService(ModelMapper modelMapper, IReportRepository iReportRepository) {
        super(modelMapper);
        this.iReportRepository = iReportRepository;
    }

    private IReportRepository iReportRepository;

    @Override
    public ArrayResultDto<ReportDto> findAll(Integer page, Integer pageSize) {
        ArrayResultDto<ReportDto> result = new ArrayResultDto<>();
        List<ReportDto> list = new ArrayList<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ReportEntity> rawData = iReportRepository.findAll(pageable);
        rawData.forEach(item -> {
            ReportDto reportDto = (super.map(item, ReportDto.class));
            list.add(reportDto);
        });
        result.setSuccess(list, rawData.getTotalElements(), rawData.getTotalPages());
        return result;
    }

    @Override
    public ReportDto searchReportByServiceNameAndAppId(String service, String appId) {

        ReportEntity rawData = iReportRepository.findByServiceNameAndAppId(service, appId);
        return super.map(rawData, ReportDto.class);
    }

    @Override
    public ArrayResultDto<ReportDto> searchReportByServiceNameAndNodeUrl(String keyword, String nodeUrl, Integer page, Integer pageSize) {
        ArrayResultDto<ReportDto> result = new ArrayResultDto<>();
        List<ReportDto> list = new ArrayList<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ReportEntity> rawData = iReportRepository.findByServiceNameAndNodeUrl(keyword, nodeUrl, pageable);
        rawData.forEach(item -> {
            ReportDto reportDto = (super.map(item, ReportDto.class));
            list.add(reportDto);
        });
        result.setSuccess(list, rawData.getTotalElements(), rawData.getTotalPages());
        return result;
    }


    @Override
    public ArrayResultDto<ReportDto> searchReportByServiceNameAndTime(String keyword, Date startDate, Date endDate, Integer page, Integer pageSize) {
        ArrayResultDto<ReportDto> result = new ArrayResultDto<>();
        List<ReportDto> list = new ArrayList<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        Page<ReportEntity> rawData;
        if (startDate == null && endDate == null) {
            rawData = iReportRepository.findByServiceNameOrderByNodeUrl(keyword, pageable);
        } else if (startDate != null && endDate == null) {
            rawData = iReportRepository.findByServiceNameAndExecutionTimeGreaterThanEqual(keyword, startDate, pageable);
        } else if (startDate == null && endDate != null) {
            rawData = iReportRepository.findByServiceNameAndExecutionTimeLessThanEqual(keyword, endDate, pageable);
        } else {
            rawData = iReportRepository.findByServiceNameAndExecutionTimeBetween(keyword, startDate, endDate, pageable);
        }

        rawData.forEach(item -> {
            ReportDto reportDto = (super.map(item, ReportDto.class));
            list.add(reportDto);
        });
        result.setSuccess(list, rawData.getTotalElements(), rawData.getTotalPages());
        return result;
    }


}
