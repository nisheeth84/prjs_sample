package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractAcceptanceBO;
import com.viettel.aio.bo.CntContractAcceptanceCstBO;
import com.viettel.aio.dao.CntContractAcceptanceCstDAO;
import com.viettel.aio.dao.CntContractAcceptanceDAO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractAcceptanceCstDTO;
import com.viettel.aio.dto.CntContractAcceptanceDTO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.aio.dto.ShipmentDTO;
import com.viettel.wms.dto.StockTransDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service("cntContractAcceptanceBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractAcceptanceBusinessImpl extends BaseFWBusinessImpl<CntContractAcceptanceDAO, CntContractAcceptanceDTO, CntContractAcceptanceBO> implements CntContractAcceptanceBusiness {

    @Autowired
    private CntContractAcceptanceDAO cntContractAcceptanceDAO;

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;
    @Autowired
    CntContractAcceptanceCstDAO cntContractAcceptanceCstDAO;

    public CntContractAcceptanceBusinessImpl() {
        tModel = new CntContractAcceptanceBO();
        tDAO = cntContractAcceptanceDAO;
    }

    @Override
    public CntContractAcceptanceDAO gettDAO() {
        return cntContractAcceptanceDAO;
    }

//	@Override
//	public CntContractAcceptanceDTO findByValue(String value) {
//		return cntContractAcceptanceDAO.findByValue(value);
//	}

    @Override
    public List<CntContractAcceptanceDTO> doSearch(CntContractAcceptanceDTO obj) {
        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_ACCEPTANCE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_ACCEPTANCE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_ACCEPTANCE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_ACCEPTANCE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
            fileType = Constants.FILETYPE.CONTRACT_MATERIAL_ACCEPTANCE;

        List<CntContractAcceptanceDTO> result = cntContractAcceptanceDAO.doSearch(obj);
        for (CntContractAcceptanceDTO cntContractAcceptance : result) {
            if (cntContractAcceptance != null) {
                UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
                criteria.setObjectId(cntContractAcceptance.getCntContractAcceptanceId());
                criteria.setType(fileType);
                List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
                cntContractAcceptance.setAttachmentLst(fileLst);
                List<CntConstrWorkItemTaskDTO> lstConstr = cntContractAcceptanceDAO.getConstructionByAcceptanceId(cntContractAcceptance);
                cntContractAcceptance.setLstConstruction(lstConstr);
                List<ShipmentDTO> lstGoods = cntContractAcceptanceDAO.getGoodsByAcceptanceId(cntContractAcceptance);
                cntContractAcceptance.setShipmentGoodsLst(lstGoods);
                List<StockTransDTO> lstStocks = cntContractAcceptanceDAO.getStockTransByAcceptanceId(cntContractAcceptance);
                cntContractAcceptance.setStockTransLst(lstStocks);
            }
        }
        return result;
    }

//	@Override
//	public List<CntContractAcceptanceDTO> getForAutoComplete(CntContractAcceptanceDTO query) {
//		return cntContractAcceptanceDAO.getForAutoComplete(query);
//	}

    public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
        return cntContractAcceptanceDAO.delete(ids, tableName, tablePrimaryKey);
    }


    public CntContractAcceptanceDTO getById(Long id) {
        return cntContractAcceptanceDAO.getById(id);
    }

    @Override
    public boolean addConstrucionAcceptance(CntContractAcceptanceDTO obj) {
        if (null != obj.getLstConstruction()) {
            List<CntContractAcceptanceCstBO> ls = new ArrayList<CntContractAcceptanceCstBO>();
            for (int i = 0; i < obj.getLstConstruction().size(); i++) {
                CntContractAcceptanceCstBO cstBO = new CntContractAcceptanceCstBO();
                cstBO.setCntContractAcceptanceId(obj.getCntContractAcceptanceId());
                cstBO.setCntContractId(obj.getCntContractId());
                cstBO.setConstructionId(obj.getLstConstruction().get(i).getConstructionId());
                ls.add(cstBO);
            }
            cntContractAcceptanceCstDAO.saveList(ls);
        }
        return true;
    }

    @Override
    public List<CntContractAcceptanceCstDTO> getAcceptanceCstByAcceptanceId(CntContractAcceptanceDTO cntContractAcceptance) {
        return cntContractAcceptanceCstDAO.doSearch(cntContractAcceptance);
    }

    @Override
    public boolean removeAcceptanceCst(List<CntContractAcceptanceCstDTO> lstCst) {
        for (int i = 0; i < lstCst.size(); i++) {
            CntContractAcceptanceCstBO bo = new CntContractAcceptanceCstBO();
            bo.setCntContractAcceptanceCstId(lstCst.get(i).getCntContractAcceptanceCstId());
            bo.setCntContractAcceptanceId(lstCst.get(i).getCntContractAcceptanceId());
            bo.setCntContractId(lstCst.get(i).getCntContractId());
            cntContractAcceptanceCstDAO.delete(bo);
        }
        return true;
    }

    @Override
    public boolean addGoodsAcceptance(CntContractAcceptanceDTO obj) {
        if (null != obj.getShipmentGoodsLst()) {
            List<CntContractAcceptanceCstBO> ls = new ArrayList<CntContractAcceptanceCstBO>();
            for (int i = 0; i < obj.getShipmentGoodsLst().size(); i++) {
                CntContractAcceptanceCstBO cstBO = new CntContractAcceptanceCstBO();
                cstBO.setCntContractAcceptanceId(obj.getCntContractAcceptanceId());
                cstBO.setCntContractId(obj.getCntContractId());
                cstBO.setShipmentGoodsId(obj.getShipmentGoodsLst().get(i).getShipmentGoodsId());
                ls.add(cstBO);
            }
            cntContractAcceptanceCstDAO.saveList(ls);
        }
        return true;
    }

    @Override
    public boolean addStockTransAcceptance(CntContractAcceptanceDTO obj) {
        if (null != obj.getStockTransLst()) {
            List<CntContractAcceptanceCstBO> ls = new ArrayList<CntContractAcceptanceCstBO>();
            for (int i = 0; i < obj.getStockTransLst().size(); i++) {
                CntContractAcceptanceCstBO cstBO = new CntContractAcceptanceCstBO();
                cstBO.setCntContractAcceptanceId(obj.getCntContractAcceptanceId());
                cstBO.setCntContractId(obj.getCntContractId());
                cstBO.setStockTransDetailId(obj.getStockTransLst().get(i).getStockTransDetailId());
                ls.add(cstBO);
            }
            cntContractAcceptanceCstDAO.saveList(ls);
        }
        return true;
    }

}
