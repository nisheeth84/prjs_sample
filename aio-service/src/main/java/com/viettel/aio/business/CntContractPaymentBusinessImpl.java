package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractPaymentBO;
import com.viettel.aio.bo.CntContractPaymentCstBO;
import com.viettel.aio.dao.CntContractPaymentCstDAO;
import com.viettel.aio.dao.CntContractPaymentDAO;
import com.viettel.aio.dto.*;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.wms.dto.StockTransDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service("cntContractPaymentBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractPaymentBusinessImpl extends BaseFWBusinessImpl<CntContractPaymentDAO, CntContractPaymentDTO, CntContractPaymentBO> implements CntContractPaymentBusiness {

    @Autowired
    private CntContractPaymentDAO cntContractPaymentDAO;
    @Autowired
    UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;
    @Autowired
    private CntContractPaymentCstDAO cntContractPaymentCstDAO;

    public CntContractPaymentBusinessImpl() {
        tModel = new CntContractPaymentBO();
        tDAO = cntContractPaymentDAO;
    }

    @Override
    public CntContractPaymentDAO gettDAO() {
        return cntContractPaymentDAO;
    }

    @Override
    public CntContractPaymentDTO findByPaymentPhase(CntContractPaymentDTO value) {
        return cntContractPaymentDAO.findByPaymentPhase(value);
    }

    @Override
    public List<CntContractPaymentDTO> doSearch(CntContractPaymentDTO obj) {
        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_PAYMENT;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_PAYMENT;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_PAYMENT;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_PAYMENT;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
            fileType = Constants.FILETYPE.CONTRACT_MATERIAL_PAYMENT;
        else if (contract.getContractType() == 7l)
            fileType = "HTCT_DR";
        else if (contract.getContractType() == 8l)
            fileType = "HTCT_DV";

        List<CntContractPaymentDTO> result = cntContractPaymentDAO.doSearch(obj);
        for (CntContractPaymentDTO cntContractPayment : result) {
            if (cntContractPayment != null) {
                UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
                criteria.setObjectId(cntContractPayment.getCntContractPaymentId());
                criteria.setType(fileType);
                List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
                cntContractPayment.setAttachmentLst(fileLst);
                List<CntConstrWorkItemTaskDTO> lstConstr = cntContractPaymentDAO.getConstructionByPaymentId(cntContractPayment);
                cntContractPayment.setLstConstruction(lstConstr);
                List<ShipmentDTO> lstGoods = cntContractPaymentDAO.getGoodsByPaymentId(cntContractPayment);
                cntContractPayment.setShipmentGoodsLst(lstGoods);
                List<StockTransDTO> lstStocks = cntContractPaymentDAO.getStockTransByPaymentId(cntContractPayment);
                cntContractPayment.setStockTransLst(lstStocks);
            }
        }
        return result;
    }

    @Override
    public List<CntContractPaymentDTO> getForAutoComplete(CntContractPaymentDTO query) {
        return cntContractPaymentDAO.getForAutoComplete(query);
    }

    //
//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return cntContractPaymentDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//	public CntContractPaymentDTO getById(Long id) {
//		return cntContractPaymentDAO.getById(id);
//	}
//
    @Override
    public boolean addConstrucionPayment(CntContractPaymentDTO obj) {
        if (null != obj.getLstConstruction()) {
            List<CntContractPaymentCstBO> ls = new ArrayList<CntContractPaymentCstBO>();
            for (int i = 0; i < obj.getLstConstruction().size(); i++) {
                CntContractPaymentCstBO cstBO = new CntContractPaymentCstBO();
                cstBO.setCntContractPaymentId(obj.getCntContractPaymentId());
                cstBO.setCntContractId(obj.getCntContractId());
                cstBO.setConstructionId(obj.getLstConstruction().get(i).getConstructionId());
                ls.add(cstBO);
            }
            cntContractPaymentCstDAO.saveList(ls);
        }
        return true;
    }

    @Override
    public List<CntContractPaymentCstDTO> getPaymentCstByPaymentId(
            CntContractPaymentDTO cntContractPayment) {
        return cntContractPaymentCstDAO.doSearch(cntContractPayment);
    }


    @Override
    public boolean removePaymentCst(List<CntContractPaymentCstDTO> lstCst) {
        for (int i = 0; i < lstCst.size(); i++) {
            CntContractPaymentCstBO bo = new CntContractPaymentCstBO();
            bo.setCntContractPaymentCstId(lstCst.get(i).getCntContractPaymentCstId());
            bo.setCntContractPaymentId(lstCst.get(i).getCntContractPaymentId());
            bo.setCntContractId(lstCst.get(i).getCntContractId());
            cntContractPaymentCstDAO.delete(bo);
        }
        return true;
    }

    @Override
    public boolean addGoodsPayment(CntContractPaymentDTO obj) {
        if (null != obj.getShipmentGoodsLst()) {
            List<CntContractPaymentCstBO> ls = new ArrayList<CntContractPaymentCstBO>();
            for (int i = 0; i < obj.getShipmentGoodsLst().size(); i++) {
                CntContractPaymentCstBO cstBO = new CntContractPaymentCstBO();
                cstBO.setCntContractPaymentId(obj.getCntContractPaymentId());
                cstBO.setCntContractId(obj.getCntContractId());
                cstBO.setShipmentGoodsId(obj.getShipmentGoodsLst().get(i).getShipmentGoodsId());
                ls.add(cstBO);
            }
            cntContractPaymentCstDAO.saveList(ls);
        }
        return true;
    }

    @Override
    public boolean addStockTransPayment(CntContractPaymentDTO obj) {
        if (null != obj.getStockTransLst()) {
            List<CntContractPaymentCstBO> ls = new ArrayList<CntContractPaymentCstBO>();
            for (int i = 0; i < obj.getStockTransLst().size(); i++) {
                CntContractPaymentCstBO cstBO = new CntContractPaymentCstBO();
                cstBO.setCntContractPaymentId(obj.getCntContractPaymentId());
                cstBO.setCntContractId(obj.getCntContractId());
                cstBO.setStockTransDetailId(obj.getStockTransLst().get(i).getStockTransDetailId());
                ls.add(cstBO);
            }
            cntContractPaymentCstDAO.saveList(ls);
        }
        return true;
    }

}
