package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.domain.service.abs.IPermissionService;
import com.viettel.vtpgw.persistence.dto.data.ImportDto;
import com.viettel.vtpgw.persistence.dto.data.PermissionImportDto;
import com.viettel.vtpgw.persistence.dto.model.PermissionDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.entity.PermissionEntity;
import com.viettel.vtpgw.persistence.repository.IPermissionRepository;
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
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PermissionService extends BaseService implements IPermissionService {

    private static Logger logger = LoggerFactory.getLogger(PermissionService.class);

    @Autowired
    public PermissionService(ModelMapper modelMapper, IPermissionRepository iPermissionRepository) {
        super(modelMapper);
        this.iPermissionRepository = iPermissionRepository;
    }

    private IPermissionRepository iPermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public ArrayResultDto<PermissionDto> findAll(Integer page, Integer pageSize) {
        ArrayResultDto<PermissionDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<PermissionDto> rawData = iPermissionRepository.findAllByOrderByIdDesc(pageable)
                .map(permissionEntity -> super.map(permissionEntity, PermissionDto.class));
        result.setSuccess(rawData);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDto<PermissionDto> findById(Long id) {
        ResultDto<PermissionDto> resultDto = new ResultDto<>();
        return iPermissionRepository.findById(id)
                .map(permissionEntity -> {
                    PermissionDto permissionDto = super.map(permissionEntity, PermissionDto.class);
                    permissionDto.setIpList(Arrays.asList(permissionDto.getIps().split(",")));
                    if (permissionEntity.getActivated() != null) {
                        Date activatedDate = new Date(permissionEntity.getActivated());
                        permissionDto.setActivated(activatedDate);
                    }
                    resultDto.setSuccess(permissionDto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    @Override
    public ResultDto<PermissionDto> update(PermissionDto dto) {
        ResultDto<PermissionDto> resultDto = new ResultDto<>();
        String email = super.getCurrentUserEmail();
        return iPermissionRepository.findById(dto.getId())
                .map(e -> {
                    super.map(dto, e);
                    e.setIps(String.join(",", dto.getIpList()));
                    e.setUpdatedDate(Instant.now());
                    e.setUpdatedBy(email);
                    e.setActivated(dto.getActivated().getTime());
                    iPermissionRepository.save(e);
                    resultDto.setSuccess(dto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setItemNotfound();
                    return resultDto;
                });
    }

    @Override
    public ResultDto<PermissionDto> add(PermissionDto dto) {
        ResultDto<PermissionDto> resultDto = new ResultDto<>();
        dto.setPermissionId(String.valueOf(UUID.randomUUID()));
        dto.setIps(String.join(",", dto.getIpList()));
        dto.setCreatedBy(super.getCurrentUserEmail());
        return Optional.ofNullable(super.map(dto, PermissionEntity.class))
                .map(e -> {
                    iPermissionRepository.save(e);
                    resultDto.setSuccess(dto);
                    return resultDto;
                })
                .orElseGet(() -> {
                    resultDto.setError();
                    return resultDto;
                });
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayResultDto<PermissionDto> search(String keyword, Integer page, Integer pageSize) {
        ArrayResultDto<PermissionDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<PermissionDto> rawData =
                iPermissionRepository.findByServiceIdContainingOrAppIdContaining(keyword, keyword, pageable)
                        .map(item -> (super.map(item, PermissionDto.class)));
        if (rawData.hasContent()) {
            result.setSuccess(rawData);
        } else {
            result.setItemNotfound();
        }
        return result;
    }

    public int importPermission(ImportDto<PermissionImportDto> importDto) {
        List<PermissionEntity> list = importDto.getRecords()
                .stream()
                .map(e -> {
                    PermissionEntity entity = super.map(e, PermissionEntity.class);
                    entity.setId(null);
                    entity.setPermissionId(StringUtils.isEmpty(e.getId()) ? UUID.randomUUID().toString() : e.getId());
                    entity.setIps(String.join(",", e.getIps()));
                    entity.setMethods(e.getMethods().get(0));
                    return entity;
                })
                .collect(Collectors.toList());
        return iPermissionRepository.saveAll(list).size();
    }
}
