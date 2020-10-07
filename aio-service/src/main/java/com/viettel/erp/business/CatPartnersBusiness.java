package com.viettel.erp.business;

import com.viettel.erp.dto.CatPartnersDTO;

import java.util.List;

public interface CatPartnersBusiness {

    long count();

    List<CatPartnersDTO> getPartnersName();

    List<CatPartnersDTO> getForAutoComplete(CatPartnersDTO query);
}
