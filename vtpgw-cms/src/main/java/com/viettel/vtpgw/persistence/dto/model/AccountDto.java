package com.viettel.vtpgw.persistence.dto.model;

import com.viettel.vtpgw.persistence.dto.base.BaseModelDto;
import com.viettel.vtpgw.validator.group.Add;
import com.viettel.vtpgw.validator.group.Update;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@Setter
@ToString
public class AccountDto extends BaseModelDto {

    private String accountId;
    @NotNull(message = "Status is required", groups = {Add.class})
    private Integer status;

    @Email(message = "Email is invalid")
    @NotEmpty(message = "Email is required", groups = {Add.class, Update.class})
    private String email;

    @NotEmpty(message = "Full name is required", groups = {Add.class, Update.class})
    private String fullname;

    @NotEmpty(message = "Phone is required", groups = {Add.class, Update.class})
    @Pattern(regexp = "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
            message = "Mobile number is invalid")
    @Size(min = 10, message = "Phone size must be at least 10 characters")
    private String phone;

    private String salt;

    @NotEmpty(message = "Password is required", groups = {Add.class, Update.class})
    @Size(min = 8, max = 10, message = "Password size must be between 8 and 10")
    private String password;
}
