package com.viettel.vtpgw.persistence.dto.base;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.viettel.vtpgw.validator.group.Update;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.Instant;

@Getter
@Setter
public class BaseModelDto extends BaseDto {
    @NotNull(message = "Id is required", groups = Update.class)
    private Long id;
    @JsonProperty(value = "created")
    private Instant createdDate;
    private String createdBy;
    @JsonProperty(value = "updated")
    private Instant updatedDate;
    private String updatedBy;
}
