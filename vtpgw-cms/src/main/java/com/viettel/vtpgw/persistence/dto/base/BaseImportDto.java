package com.viettel.vtpgw.persistence.dto.base;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BaseImportDto extends BaseDto {
    private String id;
    @JsonProperty(value = "created")
    private Date createdDate;
    private String createdBy;
    @JsonProperty(value = "updated")
    private Date updatedDate;
    private String updatedBy;
}
