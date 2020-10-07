package com.viettel.erp.business;

import com.viettel.erp.dto.ConstructionAcceptanceDTO;

import java.util.List;

public interface ConstructionAcceptanceBusiness {

    long count();

    List<ConstructionAcceptanceDTO> findByConstructId(Long constructId);

    boolean updateIsActive(Long constrAcceptanceId);
}
