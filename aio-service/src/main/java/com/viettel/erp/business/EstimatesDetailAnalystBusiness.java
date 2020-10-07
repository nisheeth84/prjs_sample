package com.viettel.erp.business;

import com.viettel.erp.dto.EstimatesDetailAnalystDTO;

import java.util.List;

public interface EstimatesDetailAnalystBusiness {

    long count();

    List<EstimatesDetailAnalystDTO> getAcceptanceList();

    List<EstimatesDetailAnalystDTO> getAcceptanceListById(Long constructId);

    List<EstimatesDetailAnalystDTO> doSearchEstimatesDetailAnalyst(EstimatesDetailAnalystDTO criteria);
}
