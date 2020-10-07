package com.viettel.vtpgw.persistence.dto.data;

import com.viettel.vtpgw.persistence.dto.base.BaseImportDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@Setter
public class ImportDto<T extends BaseImportDto> {

    @NotEmpty
    private List<@Valid T> records;
    private Long version;
}
