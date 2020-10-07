package com.viettel.erp.business;

import com.viettel.erp.dto.ConstrWorkLogsDTO;
import com.viettel.erp.dto.EstimatesWorkItemsDTO;
import com.viettel.erp.dto.approDTO;

import java.util.List;

public interface ConstrWorkLogsBusiness {

    long count();

    // ChuongNV
    List<ConstrWorkLogsDTO> getAllConstrWorkLogs(ConstrWorkLogsDTO dto);

    List<EstimatesWorkItemsDTO> getEstimatesWork(String constructId);

    void deleteConstrWorkLogs(List<String> listConstrWorkLogsId);

    String autoGenCode();

    boolean checkStatusDatabase(String constrWorkLogsId);

    Long appro(approDTO obj);

    ConstrWorkLogsDTO findById(Long constrWorkLogsId, String contractCode);

    Long addConstrWorkLogs(ConstrWorkLogsDTO obj);
}
