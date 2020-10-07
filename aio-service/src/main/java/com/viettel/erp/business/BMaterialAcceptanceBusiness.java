package com.viettel.erp.business;

import com.viettel.erp.dto.BMaterialAcceptMerListDTO;
import com.viettel.erp.dto.BMaterialAcceptanceDTO;

import java.util.List;

public interface BMaterialAcceptanceBusiness {

    long count();

    List<BMaterialAcceptanceDTO> findByConstructId(BMaterialAcceptanceDTO dto);

    boolean deleteResult(List<String> listString);

    //	List<CatEmployeeDTO> getListEmployeeByRole(SettlementRightDTO rightDTO) ;
    String autoGenCode();

    BMaterialAcceptanceDTO exportBMA(BMaterialAcceptanceDTO dto);

    List<BMaterialAcceptMerListDTO> getBMAMerList(Long bmaterialAcceptanceId);

    public Long getconstrCompReMapId(Long id);

    public boolean deleteListEntity(List<Long> listId);

}
