package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.aio.dao.CntContractFrameDAO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("cntContractFrameBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractFrameBusinessImpl extends BaseFWBusinessImpl<CntContractFrameDAO, CntContractDTO, CntContractBO> implements CntContractFrameBusiness {

    @Autowired
    private CntContractFrameDAO cntContractDAO;
//    @Autowired
//    private UtilAttachDocumentDAO utilAttachDocumentDAO;
     
    public CntContractFrameBusinessImpl() {
        tModel = new CntContractBO();
        tDAO = cntContractDAO;
    }

    @Override
    public CntContractFrameDAO gettDAO() {
        return cntContractDAO;
    }
	
//	@Override
//	public CntContractDTO findByCode(CntContractDTO obj) {
//		return cntContractDAO.findByCode(obj);
//	}
//
//	@Override
//	public List<CntContractDTO> doSearch(CntContractDTO obj) {
//		List<CntContractDTO> result = cntContractDAO.doSearch(obj);
//
//		for (CntContractDTO contract : result) {
//			if (contract != null) {
//				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
//				criteria.setObjectId(contract.getCntContractId());
//				if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT
//						.equals(obj.getContractType())) {
//					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
//				} else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN
//						.equals(obj.getContractType())) {
//					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
//				}
//				else if (Constants.CONTRACT_TYPE.CONTRACT_MATERIAL
//						.equals(obj.getContractType())) {
//					criteria.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
//				}
//				else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT
//						.equals(obj.getContractType())) {
//					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
//				}
//				else if (Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN
//						.equals(obj.getContractType())) {
//					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
//				}
//				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO
//						.doSearch(criteria);
////				List<PurchaseOrderDTO> orderLst = cntContractDAO
////						.getOrder(contract.getCntContractId());
////				contract.setPurchaseOrderLst(orderLst);
//				contract.setFileLst(fileLst);
//			}
//		}
//		return result;
//	}
	
	@Override
	public List<CntContractDTO> getForAutoComplete(CntContractDTO query) {
		return cntContractDAO.getForAutoComplete(query);
	}

//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return cntContractDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//
//	public CntContractDTO getById(Long id) {
//		return cntContractDAO.getById(id);
//	}
//
//	@Override
//	public List<CntContractDTO> doSearchContract(CntContractDTO obj) {
//		List<CntContractDTO> result = cntContractDAO.doSearchContract(obj);
//		return result;
//	}
//
////	hungtd_20190114_start
//	@Override
//	public List<CntContractDTO> getForAuto(CntContractDTO query) {
//		return cntContractDAO.getForAuto(query);
//	}
////	hungtd_20190114_end
}
