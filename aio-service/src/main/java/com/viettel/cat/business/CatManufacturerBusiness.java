package com.viettel.cat.business;

import com.viettel.cat.dto.CatManufacturerDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CatManufacturerBusiness {

    CatManufacturerDTO findByCode(String code);

    List<CatManufacturerDTO> doSearch(CatManufacturerDTO obj);

    List<CatManufacturerDTO> getForAutoComplete(CatManufacturerDTO query);

    List<CatManufacturerDTO> getForComboBox(CatManufacturerDTO query);
}
