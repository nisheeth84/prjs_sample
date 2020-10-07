package com.viettel.vtpgw.persistence.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResultDto<T> extends BaseResult {
    private T data;

    public void setSuccess(T data) {
        super.setSuccess();
        this.data = data;
    }
}
