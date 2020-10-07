package com.viettel.coms.business;

import com.viettel.coms.bo.StTransactionBO;
import com.viettel.coms.dao.HandOverHistoryDAO;
import com.viettel.coms.dto.HandOverHistoryDTORequest;
import com.viettel.coms.dto.StTransactionDTO;
import com.viettel.coms.dto.StTransactionDetailDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("HAND_OVER_HISTORY_BUSINESS_IMPL")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class HandOverHistoryBusiness extends BaseFWBusinessImpl<HandOverHistoryDAO, StTransactionDTO, StTransactionBO> {

    @Autowired
    HandOverHistoryDAO handOverHistoryDAO;

    /**
     * getValueToInitHandOverHistoryPages
     *
     * @param request
     * @param temp
     * @return List<StTransactionDTO>
     */
    public List<StTransactionDTO> getValueToInitHandOverHistoryPages(HandOverHistoryDTORequest request, int temp) {
        return handOverHistoryDAO.getValueToInitHandOverHistoryPages(request, temp);
    }

    /**
     * getValueToInitHandOverHistoryVTTB
     *
     * @param request
     * @return List<StTransactionDetailDTO>
     */
    public List<StTransactionDetailDTO> getValueToInitHandOverHistoryVTTB(HandOverHistoryDTORequest request) {
        return handOverHistoryDAO.getValueToInitHandOverHistoryVTTB(request);
    }

    /**
     * getValueToInitHandOverHistoryVTTBDetail
     *
     * @param request
     * @return List<StTransactionDetailDTO>
     */
    public List<StTransactionDetailDTO> getValueToInitHandOverHistoryVTTBDetail(HandOverHistoryDTORequest request) {
        return handOverHistoryDAO.getValueToInitHandOverHistoryVTTBDetail(request);
    }
}
