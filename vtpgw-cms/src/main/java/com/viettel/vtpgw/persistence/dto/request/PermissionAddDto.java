package com.viettel.vtpgw.persistence.dto.request;

import com.viettel.vtpgw.persistence.dto.base.BaseDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class PermissionAddDto extends BaseDto {
    private String permissionId;
    @NotEmpty(message = "App id is required")
    private String appId;

    @NotEmpty(message = "Service id is required")
    private String serviceId;
    private String ips;

    @NotEmpty(message = "Methods id is required")
    private String methods;

    @NotEmpty(message = "Activated date is required")
    private String activatedDate;

    @NotNull(message = "Capacity date is required")
    private Long capacity;

    @NotNull(message = "Period date is required")
    private Long period;
    private Integer noContent;
    private Integer sandBox;
    private Integer debug;

    private Long activated;

    @NotEmpty(message = "Ip List is required")
    private List<String> ipList;
}
