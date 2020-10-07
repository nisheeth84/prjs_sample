package com.viettel.coms.business;

import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.coms.dto.DepartmentDTO;

import java.util.List;

public interface DepartmentBusiness {

    long count();

    List<DepartmentDTO> getDeptForAutocomplete(DepartmentDTO obj);

    List<CatPartnerDTO> getAutocompleteLanHan(CatPartnerDTO obj);
}
