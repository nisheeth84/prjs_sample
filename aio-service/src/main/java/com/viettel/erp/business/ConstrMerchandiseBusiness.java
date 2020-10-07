package com.viettel.erp.business;

import com.viettel.erp.dto.ConstrMerchandiseDTO;

import java.util.List;

public interface ConstrMerchandiseBusiness {

    long count();

    List<ConstrMerchandiseDTO> gettValueConstrMerchandiseById(Long contractId);

}
