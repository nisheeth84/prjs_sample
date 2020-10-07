package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractPaymentCstDTO;
import com.viettel.aio.dto.CntContractPaymentDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractPaymentBusiness {

    CntContractPaymentDTO findByPaymentPhase(CntContractPaymentDTO value);

    List<CntContractPaymentDTO> doSearch(CntContractPaymentDTO obj);

    List<CntContractPaymentDTO> getForAutoComplete(CntContractPaymentDTO query);

    boolean addConstrucionPayment(CntContractPaymentDTO obj);

    List<CntContractPaymentCstDTO> getPaymentCstByPaymentId(CntContractPaymentDTO cntContractPayment);

    //
    boolean removePaymentCst(List<CntContractPaymentCstDTO> lstCst);

    boolean addGoodsPayment(CntContractPaymentDTO cstDTO);

    //
    boolean addStockTransPayment(CntContractPaymentDTO obj);
}
