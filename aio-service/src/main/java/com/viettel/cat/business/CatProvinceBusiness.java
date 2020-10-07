package com.viettel.cat.business;

import com.viettel.cat.dto.CatProvinceDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CatProvinceBusiness {

    CatProvinceDTO findByCode(String value);

    List<CatProvinceDTO> doSearch(CatProvinceDTO obj);

    List<CatProvinceDTO> getForComboBox(CatProvinceDTO query);
}
