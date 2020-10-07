package com.viettel.vtpgw.persistence.dto.data;

import com.viettel.vtpgw.persistence.dto.base.BaseImportDto;
import com.viettel.vtpgw.persistence.dto.model.NodeDto;
import com.viettel.vtpgw.shared.utils.Constants;
import com.viettel.vtpgw.validator.IntegerValue;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class ServiceImportDto extends BaseImportDto {
    private String serviceId;
    private Integer status;
    private String module;
    private Long idleTimeout = 0L;
    private Long connectTimeout = 0L;
    private Long timeout = 0L;
    @NotNull
    @NotBlank
    private String name;
    private String description = Constants.DEFAULT_STRING;
    private Long capacity = 0L;
    private Long period;
    private String contact = Constants.DEFAULT_STRING;
    @IntegerValue(numbers = {5, 10, 60, 1440})
    private Integer reportInterval;
    private Long standardDuration = 0L;
    private String sandboxEndpoint = Constants.DEFAULT_STRING;
    @NotNull
    private List<NodeDto> endpoints;
}
