package com.viettel.erp.business;

import com.viettel.erp.dto.ConstrWorkCompConfListLessDTO;

import java.util.List;

public interface ConstrWorkCompConfListBusiness {

    long count();

    public List<ConstrWorkCompConfListLessDTO> getListConstrWorkByConstrId(Long id);

    public List<ConstrWorkCompConfListLessDTO> getListConstrWorkExistByConstrId(List<Long> id);
}
