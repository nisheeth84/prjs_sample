package com.base.service.dto;


import com.base.validator.Add;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@AllArgsConstructor
public class UsersDto {

    @NotEmpty(message = "Name is mandatory", groups = {Add.class})
    private String email;
    @NotEmpty(message = "Name is mandatory", groups = {Add.class})
    private String password;
}
