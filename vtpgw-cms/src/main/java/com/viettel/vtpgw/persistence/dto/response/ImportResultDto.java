package com.viettel.vtpgw.persistence.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ImportResultDto<T> extends BaseResult{
    private List<T> dataFail;
    private List<T> dataSuccess;

    public ImportResultDto () {
        this.dataFail = new ArrayList<>();
        this.dataSuccess = new ArrayList<>();
    }
}
