package com.viettel.wms.business;

import com.viettel.wms.dto.PartnerDTO;

import java.util.List;


public interface PartnerBusiness {
    List<String> getForAutoComplete(PartnerDTO p);

    List<PartnerDTO> getForAutoCompleteII(String obj);

    PartnerDTO getPartnerById(Long id);
}
