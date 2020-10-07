package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.aio.dao.InCntContractDAO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.PurchaseOrderDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("InCntContractBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class InCntContractBusinessImpl extends BaseFWBusinessImpl<InCntContractDAO, CntContractDTO, CntContractBO> implements InCntContractBusiness {

    @Autowired
    private InCntContractDAO cntContractDAO;
    
    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    
     
    public InCntContractBusinessImpl() {
        tModel = new CntContractBO();
        tDAO = cntContractDAO;
    }

    @Override
    public InCntContractDAO gettDAO() {
        return cntContractDAO;
    }
	
	@Override
	public CntContractDTO findByCode(CntContractDTO obj) {
		CntContractDTO contract = cntContractDAO.findByCode(obj);
//		UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
//		if(contract != null && contract.getCntContractId() != null){
//			criteria.setObjectId(contract.getCntContractId());
//			criteria.setType("0");
//			List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentDAO.doSearch(criteria);
//			contract.setFileLst(fileLst);
//		}
		return contract;
	}

	@Override
	public List<CntContractDTO> doSearch(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.doSearch(obj);
		for(CntContractDTO contract : result){
			if(contract != null){
				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
				criteria.setObjectId(contract.getCntContractId());
				if(obj.getContractType()==8l) {
					criteria.setType("HTCT_DV");
				} else {
					criteria.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
				}
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
				List<PurchaseOrderDTO> orderLst = cntContractDAO.getOrder(contract.getCntContractId());
				List<CntContractDTO> contractLst = cntContractDAO.getContract(contract.getCntContractId());
				contract.setPurchaseOrderLst(orderLst);
				contract.setPurchaseLst(contractLst);
				contract.setFileLst(fileLst);
			}
		}
		return result;
	}	
	
	@Override
	public List<CntContractDTO> getForAutoComplete(CntContractDTO query) {
		return cntContractDAO.getForAutoComplete(query);
	}

	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
		return cntContractDAO.delete(ids, tableName, tablePrimaryKey);	
	}
	

	public CntContractDTO getById(Long id) {
		return cntContractDAO.getById(id);
	}
//	hoanm1_20180305_start
	@Override
	public List<CntContractDTO> getListContract(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.getListContract(obj);
		return result;
	}	
	
	@Override
	public List<CntContractDTO> getListContractKTTS(CntContractDTO obj) {
		List<CntContractDTO> result = cntContractDAO.getListContractKTTS(obj);
		return result;
	}	
	
	@Override
	public List<CntContractDTO> getForAutoCompleteMap(CntContractDTO query) {
		return cntContractDAO.getForAutoCompleteMap(query);
	}
	
	@Override
	public List<CntContractDTO> getForAutoCompleteKTTS(CntContractDTO query) {
		return cntContractDAO.getForAutoCompleteKTTS(query);
	}
	
	@Override
	public CntContractDTO findByCodeKTTS(String value) {
		return cntContractDAO.findByCodeKTTS(value);
	}
//	hoanm1_20180305_end

	@Override
	public List<CntContractDTO> findByCodeOut(Long value) {
		// TODO Auto-generated method stub
		return cntContractDAO.findByCodeOut(value);
	}
	
	public Long deleteContract(List<Long> cntContractMapLst ) {
		return cntContractDAO.deleteContract(cntContractMapLst);
	}
	
	/**hoangnh start 03012019**/
	public CntContractDTO checkMapConstract(String code){
		return cntContractDAO.checkMapConstract(code);
	}
	/**hoangnh end 03012019**/
}
