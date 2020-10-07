package com.viettel.cat.business;

import com.viettel.cat.dto.CatProducingCountryDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CatProducingCountryBusiness {

    CatProducingCountryDTO findByCode(String value);

    List<CatProducingCountryDTO> doSearch(CatProducingCountryDTO obj);

    List<CatProducingCountryDTO> getForAutoComplete(CatProducingCountryDTO query);
}
