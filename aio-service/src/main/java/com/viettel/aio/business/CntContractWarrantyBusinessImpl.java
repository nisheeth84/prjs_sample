package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractWarrantyBO;
import com.viettel.aio.dao.CntContractWarrantyDAO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.CntContractWarrantyDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("cntContractWarrantyBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractWarrantyBusinessImpl extends BaseFWBusinessImpl<CntContractWarrantyDAO, CntContractWarrantyDTO, CntContractWarrantyBO> implements CntContractWarrantyBusiness {

    @Autowired
    private CntContractWarrantyDAO cntContractWarrantyDAO;
    @Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;
     
    public CntContractWarrantyBusinessImpl() {
        tModel = new CntContractWarrantyBO();
        tDAO = cntContractWarrantyDAO;
    }

    @Override
    public CntContractWarrantyDAO gettDAO() {
        return cntContractWarrantyDAO;
    }
//
//	@Override
//	public CntContractWarrantyDTO findByValue(String value) {
//		return cntContractWarrantyDAO.findByValue(value);
//	}

	@Override
	public List<CntContractWarrantyDTO> doSearch(CntContractWarrantyDTO obj) {
		CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
		String fileType = "";
		if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
			fileType = Constants.FILETYPE.CONTRACT_OUT_WARRANTY;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
			fileType = Constants.FILETYPE.CONTRACT_IN_WARRANTY;
		
		List<CntContractWarrantyDTO> result = cntContractWarrantyDAO.doSearch(obj);
		for(CntContractWarrantyDTO cntContractLiquiDate : result){
			if(cntContractLiquiDate != null){
				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
				criteria.setObjectId(cntContractLiquiDate.getCntContractWarrantyId());
				criteria.setType(fileType);
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
				cntContractLiquiDate.setAttachmentLst(fileLst);
			}
		}
		return result;
	}	
	
	@Override
	public List<CntContractWarrantyDTO> getForAutoComplete(CntContractWarrantyDTO query) {
		return cntContractWarrantyDAO.getForAutoComplete(query);
	}

	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
		return cntContractWarrantyDAO.delete(ids, tableName, tablePrimaryKey);
	}
//
//
//	public CntContractWarrantyDTO getById(Long id) {
//		return cntContractWarrantyDAO.getById(id);
//	}
}
