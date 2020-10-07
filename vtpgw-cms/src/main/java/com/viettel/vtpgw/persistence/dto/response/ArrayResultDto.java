package com.viettel.vtpgw.persistence.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArrayResultDto<T> extends BaseResult {
    private List<T> listData;
    private Long totalRow = 0L;
    private Integer totalPage = 0;

    public void setSuccess(List<T> data, Long totalRow, Integer totalPage) {
        super.setSuccess();
        this.listData = data;
        this.totalRow = totalRow;
        this.totalPage = totalPage;
    }

    public void setSuccess(Page<T> rawData) {
        super.setSuccess();
        this.listData = rawData.getContent();
        this.totalRow = rawData.getTotalElements();
        this.totalPage = rawData.getTotalPages();
    }
}
