package com.viettel.erp.business;

import com.viettel.erp.dto.ConstrGroundHandoverDTO;
import com.viettel.erp.dto.approDTO;

import java.util.List;

public interface ConstrGroundHandoverBusiness {

    long count();

    List<ConstrGroundHandoverDTO> getAllConstrGroundHandover(ConstrGroundHandoverDTO dto);

    String getCode(String tableName, String value);

    boolean checkStatusDatabase(Long constrGroundHandoverId);

    String delete(List<Long> ids, String name, String string);

    ConstrGroundHandoverDTO getAllConstrGroundHandoverById(ConstrGroundHandoverDTO dto);

    Long appro(approDTO obj);

    boolean deleteOne(Long id);
}
