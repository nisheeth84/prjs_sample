package com.viettel.vtpgw.persistence.dto.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.viettel.vtpgw.persistence.dto.base.BaseModelDto;
import com.viettel.vtpgw.validator.group.Add;
import com.viettel.vtpgw.validator.group.Update;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class PermissionDto extends BaseModelDto {
    private String permissionId;
    @NotEmpty(message = "AppId is required", groups = {Add.class, Update.class})
    private String appId;
    @NotEmpty(message = "ServiceId is required", groups = {Update.class})
    private String serviceId;
    private String ips;
    @NotEmpty(message = "Methods is required", groups = {Add.class, Update.class})
    private String methods;
    @NotNull(message = "Capacity is required", groups = {Add.class, Update.class})
    private Long capacity;
    @NotNull(message = "Period is required", groups = {Add.class, Update.class})
    private Long period;
    private Integer noContent;
    private Integer sandBox;
    private Integer debug;

    @JsonFormat(pattern="yyyy-MM-dd\'T\'HH:mm")
    @NotNull(message = "Activated date is required", groups = Add.class)
    private Date activated;
    @NotEmpty(message = "Ip List is required", groups = {Add.class, Update.class})
    private List<String> ipList;
}
