package com.viettel.vtpgw.persistence.dto.model;

import com.viettel.vtpgw.persistence.dto.base.BaseModelDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Getter
@Setter
@ToString
public class NodeDto extends BaseModelDto {

    private String nodeId;

    @NotEmpty(message = "Service id is required")
    private String serviceId;

    @NotEmpty(message = "Url is required")
    private String url;

    @NotEmpty(message = "Check url is required")
    private String checkUrl;

    @NotNull(message = "Status is required")
    private Integer status;
}
