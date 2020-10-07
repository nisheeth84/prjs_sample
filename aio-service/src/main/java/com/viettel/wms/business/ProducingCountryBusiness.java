package com.viettel.wms.business;

import com.viettel.wms.dto.ProducingCountryDTO;

import java.util.List;

public interface ProducingCountryBusiness {

    long count();

    List<ProducingCountryDTO> getAllNameAndId();

    List<ProducingCountryDTO> getForAutocomplete(ProducingCountryDTO obj);

    ProducingCountryDTO getAllNameById(Long id);
}
