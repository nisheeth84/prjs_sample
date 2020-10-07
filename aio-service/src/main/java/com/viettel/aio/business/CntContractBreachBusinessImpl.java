package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractBreachBO;
import com.viettel.aio.dao.CntContractBreachDAO;
import com.viettel.aio.dto.CntContractBreachDTO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("cntContractBreachBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractBreachBusinessImpl extends BaseFWBusinessImpl<CntContractBreachDAO, CntContractBreachDTO, CntContractBreachBO> implements CntContractBreachBusiness {

    @Autowired
    private CntContractBreachDAO cntContractBreachDAO;
    @Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;
    public CntContractBreachBusinessImpl() {
        tModel = new CntContractBreachBO();
        tDAO = cntContractBreachDAO;
    }

    @Override
    public CntContractBreachDAO gettDAO() {
        return cntContractBreachDAO;
    }
	
	@Override
	public CntContractBreachDTO findByValue(String value) {
		return cntContractBreachDAO.findByValue(value);
	}

	@Override
	public List<CntContractBreachDTO> doSearch(CntContractBreachDTO obj) {
		CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
		String fileType = "";
		if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
			fileType = Constants.FILETYPE.CONTRACT_OUT_BREACH;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
			fileType = Constants.FILETYPE.CONTRACT_IN_BREACH;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_BREACH;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_BREACH;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
			fileType = Constants.FILETYPE.CONTRACT_MATERIAL_BREACH;
		
		List<CntContractBreachDTO> result = cntContractBreachDAO.doSearch(obj);
		for(CntContractBreachDTO cntContractAcceptance : result){
			if(cntContractAcceptance != null){
				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
				criteria.setObjectId(cntContractAcceptance.getCntContractBreachId());
				criteria.setType(fileType);
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
				cntContractAcceptance.setAttachmentLst(fileLst);
			}
		}
		return result;
	}	
	
	@Override
	public List<CntContractBreachDTO> getForAutoComplete(CntContractBreachDTO query) {
		return cntContractBreachDAO.getForAutoComplete(query);
	}

	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
		return cntContractBreachDAO.delete(ids, tableName, tablePrimaryKey);	
	}
	public CntContractBreachDTO getById(Long id) {
		return cntContractBreachDAO.getById(id);
	}
}
