package com.viettel.vtpgw.persistence.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class PermissionUpdateDto {

    @NotNull(message = "Id is required")
    private Long id;

    @NotEmpty(message = "App id is required")
    private String appId;

    @NotEmpty(message = "Service id is required")
    private String serviceId;
    private String ips;
    private String methods;

    @NotEmpty(message = "Activated date is required")
    private String activatedDate;
    private Long capacity;
    private Long period;
    private Integer noContent;
    private Integer sandBox;
    private Integer debug;
    private List<String> ipList;

    @NotEmpty(message = "UpdatedBy is required")
    private String updatedBy;
}
