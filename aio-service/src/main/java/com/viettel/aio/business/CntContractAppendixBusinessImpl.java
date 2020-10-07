package com.viettel.aio.business;

import com.viettel.aio.bo.CntContractAppendixBO;
import com.viettel.aio.dao.CntContractAppendixDAO;
import com.viettel.aio.dto.CntContractAppendixDTO;
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


@Service("cntContractAppendixBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CntContractAppendixBusinessImpl extends BaseFWBusinessImpl<CntContractAppendixDAO, CntContractAppendixDTO, CntContractAppendixBO> implements CntContractAppendixBusiness {

    @Autowired
    private CntContractAppendixDAO cntContractAppendixDAO;
    @Autowired
    UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;

    public CntContractAppendixBusinessImpl() {
        tModel = new CntContractAppendixBO();
        tDAO = cntContractAppendixDAO;
    }

    @Override
    public CntContractAppendixDAO gettDAO() {
        return cntContractAppendixDAO;
    }
//
//	@Override
//	public CntContractAppendixDTO findByValue(String value) {
//		return cntContractAppendixDAO.findByValue(value);
//	}

    @Override
    public List<CntContractAppendixDTO> doSearch(CntContractAppendixDTO obj) {
        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_APPENDIX;
        List<CntContractAppendixDTO> result = cntContractAppendixDAO.doSearch(obj);
        for (CntContractAppendixDTO cntContractAcceptance : result) {
            if (cntContractAcceptance != null) {
                UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
                criteria.setObjectId(cntContractAcceptance.getCntContractAppendixId());
                criteria.setType(fileType);
                List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO.doSearch(criteria);
                cntContractAcceptance.setAttachmentLst(fileLst);
            }
        }
        return result;
    }

    @Override
    public List<CntContractAppendixDTO> getForAutoComplete(CntContractAppendixDTO query) {
        return cntContractAppendixDAO.getForAutoComplete(query);
    }
//
//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return cntContractAppendixDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//	public CntContractAppendixDTO getById(Long id) {
//		return cntContractAppendixDAO.getById(id);
//	}
}
