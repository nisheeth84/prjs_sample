package com.viettel.vtpgw.persistence.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
public class ObjectsImportDto<T> {
    @Valid
    private List<T> records;
}
