package com.base.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class MenusDto {
    private Integer id;
    private String menuCode;
    private String menuAction;
}
