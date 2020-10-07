package com.viettel.vtpgw.persistence.dto.model;

import com.viettel.vtpgw.persistence.dto.base.BaseModelDto;
import com.viettel.vtpgw.validator.group.Add;
import com.viettel.vtpgw.validator.group.Update;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class ApplicationDto extends BaseModelDto {

    private String applicationId;
    @NotNull(message = "Status is required", groups = {Add.class})
    private Integer status;

    @NotEmpty(message = "Token is required", groups = {Add.class, Update.class})
    private String token;

    @Email(message = "ContactEntity email is invalid")
    @NotEmpty(message = "ContactEntity email is required", groups = {Add.class, Update.class})
    private String contact;

    @NotEmpty(message = "App id is required", groups = {Add.class, Update.class})
    private String appId;
}
