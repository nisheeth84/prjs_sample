package com.viettel.wms.business;

import com.viettel.wms.dto.ManufacturerDTO;

import java.util.List;

public interface ManufacturerBusiness {

    long count();

    List<ManufacturerDTO> getAllNameAndId();

    List<ManufacturerDTO> getForAutocomplete(ManufacturerDTO obj);

    ManufacturerDTO getAllNameById(Long id);
}
