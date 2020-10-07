package com.viettel.vtpgw.persistence.dto.data;

import com.viettel.vtpgw.persistence.dto.base.BaseImportDto;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class ApplicationImportDto extends BaseImportDto {

    private String applicationId;
    @NotNull
    private Integer status;
    @NotEmpty
    private String token;
    @Email(message = "ContactEntity email is invalid")
    private String contact;
    @NotEmpty
    private String appId;
}
