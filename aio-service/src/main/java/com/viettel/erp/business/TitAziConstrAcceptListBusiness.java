package com.viettel.erp.business;

import com.viettel.erp.dto.TitAziConstrAcceptListDTO;

import java.util.List;

public interface TitAziConstrAcceptListBusiness {

    long count();

    List<TitAziConstrAcceptListDTO> listById(Long titAziConstrAcceptId);

    boolean deleteList(List<String> listString);
}
