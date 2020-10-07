package com.viettel.vtpgw.config;

import com.viettel.vtpgw.persistence.dto.data.ApplicationImportDto;
import com.viettel.vtpgw.persistence.dto.data.AccountImportDto;
import com.viettel.vtpgw.persistence.dto.data.PermissionImportDto;
import com.viettel.vtpgw.persistence.dto.data.ServiceImportDto;
import com.viettel.vtpgw.persistence.dto.model.PermissionDto;
import com.viettel.vtpgw.persistence.dto.model.ServiceDto;
import com.viettel.vtpgw.persistence.dto.model.ApplicationDto;
import com.viettel.vtpgw.persistence.entity.ApplicationEntity;
import com.viettel.vtpgw.persistence.dto.model.AccountDto;
import com.viettel.vtpgw.persistence.entity.AccountEntity;
import com.viettel.vtpgw.persistence.entity.PermissionEntity;
import com.viettel.vtpgw.persistence.entity.ServiceEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        mapper.typeMap(PermissionImportDto.class, PermissionEntity.class)
                .addMappings(mapping -> {
                    mapping.map(PermissionImportDto::getId, PermissionEntity::setPermissionId);
                    mapping.skip(PermissionEntity::setId);
                });
        mapper.typeMap(PermissionDto.class, PermissionEntity.class)
                .addMappings(mapping -> {
                    mapping.skip(PermissionEntity::setCreatedBy);
                    mapping.skip(PermissionEntity::setCreatedDate);
                });
        mapper.typeMap(ServiceImportDto.class, ServiceEntity.class)
                .addMappings(mapping -> {
                    mapping.map(ServiceImportDto::getId, ServiceEntity::setServiceId);
                    mapping.skip(ServiceEntity::setId);
                });
        mapper.typeMap(ServiceDto.class, ServiceEntity.class)
                .addMappings(mapping -> {
                    mapping.skip(ServiceEntity::setCreatedBy);
                    mapping.skip(ServiceEntity::setCreatedDate);
                });
        mapper.typeMap(AccountImportDto.class, AccountEntity.class)
                .addMappings(mapping -> {
                    mapping.map(AccountImportDto::getId, AccountEntity::setAccountId);
                    mapping.skip(AccountEntity::setId);
                });
        mapper.typeMap(AccountDto.class, AccountEntity.class)
                .addMappings(mapping -> {
                    mapping.skip(AccountEntity::setCreatedBy);
                    mapping.skip(AccountEntity::setCreatedDate);
                });
        mapper.typeMap(ApplicationImportDto.class, ApplicationEntity.class)
                .addMappings(mapping -> {
                    mapping.map(ApplicationImportDto::getId, ApplicationEntity::setApplicationId);
                    mapping.skip(ApplicationEntity::setId);
                });
        mapper.typeMap(ApplicationDto.class, ApplicationEntity.class)
                .addMappings(mapping -> {
                    mapping.skip(ApplicationEntity::setCreatedBy);
                    mapping.skip(ApplicationEntity::setCreatedDate);
                });

        return mapper;
    }
}
