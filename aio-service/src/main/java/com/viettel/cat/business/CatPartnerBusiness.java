package com.viettel.cat.business;

import com.viettel.cat.dto.CatPartnerDTO;

import java.util.List;
//import com.viettel.cat.dto.CatUnitDTO;

/**
 * @author hailh10
 */

public interface CatPartnerBusiness {

    CatPartnerDTO findByCode(String value);

    List<CatPartnerDTO> doSearch(CatPartnerDTO obj);

    List<CatPartnerDTO> getForAutoComplete(CatPartnerDTO query);

    List<CatPartnerDTO> getForComboBox(CatPartnerDTO query);
}
