package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.domain.service.abs.IServiceService;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.data.ServiceImportDto;
import com.viettel.vtpgw.persistence.dto.model.ServiceDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.entity.ServiceEntity;
import com.viettel.vtpgw.persistence.repository.IServiceRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceService extends BaseService implements IServiceService {
    private static Logger logger = LoggerFactory.getLogger(ServiceService.class);
    private IServiceRepository iServiceRepository;

    @Autowired
    public ServiceService(ModelMapper modelMapper, IServiceRepository iServiceRepository) {
        super(modelMapper);
        this.iServiceRepository = iServiceRepository;
    }

    @Transactional(readOnly = true)
    public ArrayResultDto<ServiceDto> findAll(Integer page, Integer pageSize) {
        ArrayResultDto<ServiceDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ServiceDto> rawData = iServiceRepository.findAllByOrderByIdDesc(pageable);
        result.setSuccess(rawData);
        return result;
    }

    @Transactional(readOnly = true)
    public ResultDto<ServiceDto> findById(Long id) {
        ResultDto<ServiceDto> resultDto = new ResultDto<>();
        return iServiceRepository.findById(id)
                .map(service -> {
                    ServiceDto serviceDto = super.map(service, ServiceDto.class);
                    resultDto.setSuccess(serviceDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    public ResultDto<ServiceDto> update(ServiceDto dto) {
        ResultDto<ServiceDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        return iServiceRepository.findById(dto.getId())
                .map(service -> {
                    service.getEndpoints().clear();
                    super.map(dto, service);
                    service.setUpdatedBy(email);
                    service.setUpdatedDate(Instant.now());
                    iServiceRepository.save(service);
                    resultDto.setSuccess(dto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    public ResultDto<ServiceDto> add(ServiceDto dto) {
        ResultDto<ServiceDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        if (!checkExistName(dto.getName())) {
            ServiceEntity entity = super.map(dto, ServiceEntity.class);
            entity.setCreatedBy(email);
            entity.setServiceId(String.valueOf(UUID.randomUUID()));
            iServiceRepository.save(entity);
            resultDto.setSuccess(dto);
        } else {
            resultDto.setError();
        }
        return resultDto;
    }

    @Transactional(readOnly = true)
    public ArrayResultDto<ServiceDto> search(String keyword, Integer page, Integer pageSize) {
        ArrayResultDto<ServiceDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ServiceDto> rawData = iServiceRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(service -> (super.map(service, ServiceDto.class)));
        if (rawData.hasContent()) {
            result.setSuccess(rawData);
        } else {
            result.setItemNotfound();
        }
        return result;
    }

    public boolean checkExistName(String name) {
        ServiceEntity service = iServiceRepository.findByName(name);
        return !Objects.isNull(service);
    }

    public int importService(ImportDto<ServiceImportDto> importDto) {
        List<ServiceEntity> list = importDto.getRecords()
                .stream()
                .map(e -> {
                    ServiceEntity entity = super.map(e, ServiceEntity.class);
                    entity.setId(null);
                    entity.setServiceId(StringUtils.isEmpty(e.getId()) ? UUID.randomUUID().toString() : e.getId());
                    return entity;
                })
                .collect(Collectors.toList());
        return iServiceRepository.saveAll(list).size();
    }
}
