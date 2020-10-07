package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractLiquidateBO;
import com.viettel.aio.dao.CntContractLiquidateDAO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.CntContractLiquidateDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("cntContractLiquidateBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractLiquidateBusinessImpl extends BaseFWBusinessImpl<CntContractLiquidateDAO, CntContractLiquidateDTO, CntContractLiquidateBO> implements CntContractLiquidateBusiness {

    @Autowired
    private CntContractLiquidateDAO cntContractLiquidateDAO;
    @Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;
    public CntContractLiquidateBusinessImpl() {
        tModel = new CntContractLiquidateBO();
        tDAO = cntContractLiquidateDAO;
    }

    @Override
    public CntContractLiquidateDAO gettDAO() {
        return cntContractLiquidateDAO;
    }
	
	@Override
	public CntContractLiquidateDTO findByValue(String value) {
		return cntContractLiquidateDAO.findByValue(value);
	}

	@Override
	public List<CntContractLiquidateDTO> doSearch(CntContractLiquidateDTO obj) {
		CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
		String fileType = "";
		if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
			fileType = Constants.FILETYPE.CONTRACT_OUT_LIQUIDATE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
			fileType = Constants.FILETYPE.CONTRACT_IN_LIQUIDATE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_LIQUIDATE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_LIQUIDATE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
			fileType = Constants.FILETYPE.CONTRACT_MATERIAL_LIQUIDATE;
		
		List<CntContractLiquidateDTO> result = cntContractLiquidateDAO.doSearch(obj);
		for(CntContractLiquidateDTO cntContractLiquiDate : result){
			if(cntContractLiquiDate != null){
				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
				criteria.setObjectId(cntContractLiquiDate.getCntContractLiquidateId());
				criteria.setType(fileType);
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
				cntContractLiquiDate.setAttachmentLst(fileLst);
			}
		}
		return result;
		
	}	
	
	@Override
	public List<CntContractLiquidateDTO> getForAutoComplete(CntContractLiquidateDTO query) {
		return cntContractLiquidateDAO.getForAutoComplete(query);
	}

	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
		return cntContractLiquidateDAO.delete(ids, tableName, tablePrimaryKey);	
	}
	
	
	public CntContractLiquidateDTO getById(Long id) {
		return cntContractLiquidateDAO.getById(id);
	}
}
