package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.domain.service.abs.IApplicationService;
import com.viettel.vtpgw.persistence.dto.data.ApplicationImportDto;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.model.ApplicationDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.entity.ApplicationEntity;
import com.viettel.vtpgw.persistence.repository.IApplicationRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService extends BaseService implements IApplicationService {

    private static Logger logger = LoggerFactory.getLogger(ApplicationService.class);
    private IApplicationRepository iApplicationRepository;

    @Autowired
    public ApplicationService(ModelMapper modelMapper, IApplicationRepository iApplicationRepository) {
        super(modelMapper);
        this.iApplicationRepository = iApplicationRepository;
    }

    @Override
    @Transactional
    public ArrayResultDto<ApplicationDto> findAll(Integer page, Integer pageSize) {
        ArrayResultDto<ApplicationDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ApplicationDto> rawData = iApplicationRepository.findAllByOrderByIdDesc(pageable)
                .map(a -> super.map(a, ApplicationDto.class));
        result.setSuccess(rawData);
        return result;
    }

    @Override
    public ResultDto<ApplicationDto> findById(Long id) {
        ResultDto<ApplicationDto> resultDto = new ResultDto<>();
        return iApplicationRepository.findById(id)
                .map(ae -> {
                    ApplicationDto applicationDto = super.map(ae, ApplicationDto.class);
                    resultDto.setSuccess(applicationDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    @Override
    public ResultDto<ApplicationDto> update(ApplicationDto applicationDto) {
        ResultDto<ApplicationDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        return iApplicationRepository.findById(applicationDto.getId())
                .map(ae -> {
                    super.map(applicationDto, ae);
                    ae.setUpdatedBy(email);
                    ae.setUpdatedDate(Instant.now());
                    ae.setToken(applicationDto.getToken().trim());
                    ae.setAppId(applicationDto.getAppId().trim());
                    iApplicationRepository.save(ae);
                    resultDto.setSuccess(applicationDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    @Override
    public ResultDto<ApplicationDto> add(ApplicationDto applicationDto) {
        ResultDto<ApplicationDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        applicationDto.setApplicationId(String.valueOf(UUID.randomUUID()));
        applicationDto.setToken(applicationDto.getToken().trim());
        applicationDto.setAppId(applicationDto.getAppId().trim());
        return Optional.ofNullable(super.map(applicationDto, ApplicationEntity.class))
                .map(ae -> {
                    ae.setCreatedBy(email);
                    ae.setCreatedDate(Instant.now());
                    iApplicationRepository.save(ae);
                    resultDto.setSuccess(applicationDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setError();
                    return resultDto;
                });
    }

    @Override
    public ArrayResultDto<ApplicationDto> search(String keyword, Integer page, Integer pageSize) {
        ArrayResultDto<ApplicationDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ApplicationDto> rawData = iApplicationRepository.findByAppIdContainingOrContactContaining(keyword, keyword, pageable)
                .map(item -> (super.map(item, ApplicationDto.class)));
        if (rawData.hasContent()) {
            result.setSuccess(rawData);
            return result;
        } else {
            result.setItemNotfound();
            return result;
        }
    }

    public int importApplication(ImportDto<ApplicationImportDto> importDto) {
        List<ApplicationEntity> list = importDto.getRecords()
                .stream()
                .map(aid -> {
                    ApplicationEntity entity = super.map(aid, ApplicationEntity.class);
                    entity.setId(null);
                    entity.setApplicationId(StringUtils.isEmpty(aid.getId()) ? UUID.randomUUID().toString() : aid.getId());
                    fetchDate(entity, aid);
                    return entity;
                })
                .collect(Collectors.toList());
        return iApplicationRepository.saveAll(list).size();
    }

    private void fetchDate(ApplicationEntity application, ApplicationImportDto applicationDto) {
        if (Optional.ofNullable(applicationDto.getCreatedDate()).isPresent()) {
            application.setCreatedDate(applicationDto.getCreatedDate().toInstant());
        }
        if (Optional.ofNullable(applicationDto.getUpdatedDate()).isPresent()) {
            application.setUpdatedDate(applicationDto.getUpdatedDate().toInstant());
        }
    }
}
