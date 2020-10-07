package com.viettel.vtpgw.persistence.dto.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.viettel.vtpgw.persistence.dto.base.BaseImportDto;
import com.viettel.vtpgw.validator.ListCheck;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class PermissionImportDto extends BaseImportDto {

    @NotBlank
    private String appId;
    @NotBlank
    private String serviceId;
    @NotEmpty
    @ListCheck(ip = "ip", message = "Ip wrong format")
    private List<String> ips;
    @NotEmpty
    @ListCheck(method = {"GET", "POST"}, message = "Method can only be GET, POST")
    private List<String> methods;
    private Long capacity;
    private Long period;
    private Integer noContent;
    private Integer sandBox;
    private Integer debug;
    @JsonFormat(pattern = "yyyy-MM-dd\'T\'HH:mm")
    private Date activated;

    public void setDebug(boolean debug) {
        this.debug = debug ? 1 : 0;
    }

    public void setNoContent(boolean noContent) {
        this.noContent = noContent ? 1 : 0;
    }

    public void setSandBox(boolean sandBox) {
        this.sandBox = sandBox ? 1 : 0;
    }
}
