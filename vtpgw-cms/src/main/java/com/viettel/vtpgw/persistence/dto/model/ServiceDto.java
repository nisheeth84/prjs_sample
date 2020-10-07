package com.viettel.vtpgw.persistence.dto.model;

import com.viettel.vtpgw.persistence.dto.base.BaseModelDto;
import com.viettel.vtpgw.persistence.entity.ServiceEntity;
import com.viettel.vtpgw.shared.utils.Constants;
import com.viettel.vtpgw.validator.IntegerValue;
import com.viettel.vtpgw.validator.group.Add;
import com.viettel.vtpgw.validator.group.Update;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class ServiceDto extends BaseModelDto {
    private String serviceId;
    private Integer status;
    private String module;
    private Long idleTimeout = 0L;
    private Long connectTimeout = 0L;
    private Long timeout = 0L;
    @NotNull(message = "Name is required", groups = {Add.class, Update.class})
    @NotBlank
    private String name;
    private String description = Constants.DEFAULT_STRING;
    private Long capacity = 0L;
    private Long period;
    private String contact = Constants.DEFAULT_STRING;
    @NotNull(message = "Interval is required", groups = {Add.class})
    @IntegerValue(numbers = {5, 10, 60, 1440})
    private Integer reportInterval;
    private Long standardDuration = 0L;
    private String sandboxEndpoint = Constants.DEFAULT_STRING;
    @NotNull(message = "Urls is required", groups = {Add.class, Update.class})
    private List<NodeDto> endpoints;

    public ServiceDto(Long id, String serviceId, Integer status, String module, Long idleTimeout, Long connectTimeout, String name,
                      String description, Long capacity, Long period, String contact, Integer reportInterval,
                      Long standardDuration, String sandboxEndpoint) {
        this.serviceId = serviceId;
        this.status = status;
        this.module = module;
        this.idleTimeout = idleTimeout;
        this.connectTimeout = connectTimeout;
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.period = period;
        this.contact = contact;
        this.reportInterval = reportInterval;
        this.standardDuration = standardDuration;
        this.sandboxEndpoint = sandboxEndpoint;
        this.setId(id);
    }
}
