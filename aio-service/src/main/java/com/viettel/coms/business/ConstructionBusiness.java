package com.viettel.coms.business;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.viettel.coms.dto.CatStationDTO;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.service.base.dto.DataListDTO;

public interface ConstructionBusiness {

    long count();

    DataListDTO getStationForAutoComplete(CatStationDTO obj);

    Long updateDayHshc(ConstructionDetailDTO obj) throws Exception;
    

}