package com.viettel.erp.business;

import com.viettel.erp.bo.ConstrAcceptLostNoteBO;
import com.viettel.erp.dao.ConstrAcceptLostNoteDAO;
import com.viettel.erp.dto.ConstrAcceptLostNoteDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("constrAcceptLostNoteBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstrAcceptLostNoteBusinessImpl extends BaseFWBusinessImpl<ConstrAcceptLostNoteDAO, ConstrAcceptLostNoteDTO, ConstrAcceptLostNoteBO> implements ConstrAcceptLostNoteBusiness {

    @Autowired
    private ConstrAcceptLostNoteDAO constrAcceptLostNoteDAO;


    public ConstrAcceptLostNoteBusinessImpl() {
        tModel = new ConstrAcceptLostNoteBO();
        tDAO = constrAcceptLostNoteDAO;
    }

    @Override
    public ConstrAcceptLostNoteDAO gettDAO() {
        return constrAcceptLostNoteDAO;
    }

    @Override
    public long count() {
        return constrAcceptLostNoteDAO.count("ConstrAcceptLostNoteBO", null);
    }

    @Override
    public List<ConstrAcceptLostNoteDTO> getValueLossById(Long contractId) {
        return constrAcceptLostNoteDAO.getValueLoss(contractId);
    }

}
