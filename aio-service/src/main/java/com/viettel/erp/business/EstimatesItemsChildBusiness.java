package com.viettel.erp.business;

import com.viettel.erp.dto.EstimatesItemsChildDTO;

import java.util.List;

public interface EstimatesItemsChildBusiness {

    long count();

    //haibt
    List<EstimatesItemsChildDTO> getAllItemsChildInContruct(Long constructionId);

    List<EstimatesItemsChildDTO> getListEstimateItemschild(EstimatesItemsChildDTO rightDTO);
}
