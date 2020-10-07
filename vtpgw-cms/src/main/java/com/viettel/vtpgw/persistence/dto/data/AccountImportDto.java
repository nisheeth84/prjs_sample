package com.viettel.vtpgw.persistence.dto.data;

import com.viettel.vtpgw.persistence.dto.base.BaseImportDto;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
public class AccountImportDto extends BaseImportDto {
    @NotNull
    private Integer status;

    @Email(message = "Email is invalid")
    @NotEmpty
    @NotBlank
    private String email;

    @NotEmpty
    @NotBlank
    private String fullname;
    @Pattern(regexp = "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
            message = "Mobile number is invalid")
    @Size(min = 10, message = "Phone size must be at least 10 characters")
    private String phone;
    private String salt;

    @NotEmpty
    @NotBlank
    private String password;
}
